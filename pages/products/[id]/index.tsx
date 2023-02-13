import Carousel from 'nuka-carousel/lib/carousel'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import CustomEditor from '@components/Editor'
import { useRouter } from 'next/router'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { GetServerSidePropsContext } from 'next'
import { Cart, products, OrderItem } from '@prisma/client'
import { format } from 'date-fns'
import { CATEGORY_MAP } from 'constants/products'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@mantine/core'
import { IconHeart, IconHeartbeat, IconShoppingCart } from '@tabler/icons'
import { useSession } from 'next-auth/react'
import { validateConfig } from 'next/dist/server/config-shared'
import { CountControl } from '@components/CountControl'
import { CART_QUERY_KEY } from 'pages/cart'
import { ORDER_QUERY_KEY } from 'pages/my'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // server Side 는 http 포함 url 이어야됨
  const product = await fetch(
    `http://localhost:3000/api/get-product?id=${context.params?.id}`
  )
    .then((res) => res.json())
    .then((data) => data.items)

  return {
    props: {
      product: { ...product, images: [product.image_url, product.image_url] },
    },
  }
}

const WITHLIST_QUERY_KEY = '/api/get-wishlist'

export default function Products(props: {
  product: products & { images: string[] }
}) {
  const [index, setIndex] = useState(0)
  const { data: session } = useSession()
  const [quantity, setQuantity] = useState(1)

  const router = useRouter()
  const queryClient = useQueryClient()

  const { id: productId } = router.query
  const [editorState] = useState<EditorState | undefined>(() =>
    props.product.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.product.contents))
        )
      : EditorState.createEmpty()
  )

  const { data: wishlist } = useQuery([WITHLIST_QUERY_KEY], () =>
    fetch(WITHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items)
  )

  const { mutate, isLoading } = useMutation<unknown, unknown, string, any>(
    (productId) =>
      fetch(`/api/update-wishlist`, {
        method: 'POST',
        body: JSON.stringify({ productId }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      // onMutate 는 mutation  함수가 실행되기 전에 실행된다.
      // mutation 함수가 받을 동일한 변수가 전달된다.
      onMutate: async (productId) => {
        //Optimistic updates : 요청시 성공을 했을거라고 예측하고 화면을 업데이트한다.
        await queryClient.cancelQueries([WITHLIST_QUERY_KEY])

        // Snapshot the previous value
        const previous = queryClient.getQueryData([WITHLIST_QUERY_KEY])

        // Optimistically update to the new value
        queryClient.setQueryData<string[]>([WITHLIST_QUERY_KEY], (old) =>
          old
            ? old.includes(String(productId))
              ? old.filter((id) => id !== String(productId))
              : old.concat(String(productId))
            : []
        )

        // Return a context object with the snapshotted value
        return { previous }
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData([WITHLIST_QUERY_KEY], context.previousTodos)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([WITHLIST_QUERY_KEY])
      },
    }
  )

  const { mutate: addCart } = useMutation<
    unknown,
    unknown,
    Omit<Cart, 'id' | 'userId'>,
    any
  >(
    (item) =>
      fetch(`/api/add-cart`, {
        method: 'POST',
        body: JSON.stringify({ item }),
      })
        .then((data) => data.json())
        .then((res) => res.items),

    {
      onMutate: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY])
      },
      onSuccess: () => {
        router.push('/cart')
      },
    }
  )

  const { mutate: addOrder } = useMutation<
    unknown,
    unknown,
    Omit<OrderItem, 'id'>[],
    any
  >(
    (items) =>
      fetch(`/api/add-order`, {
        method: 'POST',
        body: JSON.stringify({ items }),
      })
        .then((data) => data.json())
        .then((res) => res.items),

    {
      onMutate: () => {
        queryClient.invalidateQueries([ORDER_QUERY_KEY])
      },
      onSuccess: () => {
        router.push('/my')
      },
    }
  )

  const product = props.product
  const validate = (type: 'cart' | 'order') => {
    if (quantity == null) {
      alert('최소 수량을 입력하세요')
      return
    }

    if (type === 'cart') {
      addCart({
        productId: product.id,
        quantity: quantity,
        amount: product.price * quantity,
      })
    }

    if (type === 'order') {
      addOrder([
        {
          productId: product.id,
          quantity: quantity,
          amount: product.price * quantity,
          price: product.price,
        },
      ])
    }
  }

  const isWished =
    wishlist != null && productId != null
      ? wishlist.includes(String(productId))
      : false

  // useEffect(() => {
  //   if (productId != null) {
  //     fetch(`/api/get-product?id=${productId}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data)
  //         if (data.items.contents) {
  //           setEditorState(
  //             EditorState.createWithContent(
  //               //convertFromRaw(JSON.parse(data.items.contents))
  //               convertFromRaw(JSON.parse(data.items.contents))
  //             )
  //           )
  //         } else {
  //           setEditorState(EditorState.createEmpty())
  //         }
  //       })
  //   }
  // }, [productId])

  return (
    <>
      {product != null && productId != null ? (
        <div className="flex flex-row">
          <div className="max-w-xl mr-14">
            <Carousel
              animation="fade"
              autoplay
              withoutControls
              wrapAround
              speed={10}
              slideIndex={index}
            >
              {product.images.map((url, index) => (
                <Image
                  key={`${url}-carousel-${index}`}
                  src={url}
                  alt="image"
                  width={600}
                  height={600}
                  layout="responsive"
                />
              ))}
            </Carousel>
            <div className="flex space-x-4 mt-4">
              {product.images.map((url, idx) => (
                <div
                  key={`${url}-thumb-${index}`}
                  onClick={() => {
                    setIndex(idx)
                  }}
                >
                  <Image src={url} width={100} height={100} alt="image" />
                </div>
              ))}
            </div>
            {editorState != null && (
              <CustomEditor editorState={editorState} readOnly />
            )}
          </div>
          <div className="max-w-xl flex flex-col space-y-6">
            <div className="text-lg text-zinc-400">
              {CATEGORY_MAP[product.category_id - 1]}
            </div>
            <div className="text-4xl font-semibold">{product.name}</div>
            <div className="text-lg">
              {product.price.toLocaleString('KO-KR')} 원
            </div>
            <div>
              <span className="text-lg">수량</span>
              <CountControl value={quantity} setValue={setQuantity} />
            </div>
            <div className="flex space-x-3">
              <Button
                leftIcon={<IconShoppingCart size={20} stroke={1.5} />}
                className="bg-black"
                radius="xl"
                size="md"
                styles={{ root: { paddingRight: 14, height: 48 } }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인 해주세요')
                    router.push('/auth/login')
                    return
                  }
                  validate('cart')
                }}
              >
                장바구니
              </Button>
              <Button
                //loading={isLoading}
                disabled={wishlist == null}
                leftIcon={
                  isWished ? (
                    <IconHeart size={20} stroke={1.5} />
                  ) : (
                    <IconHeartbeat size={20} stroke={1.5} />
                  )
                }
                className={isWished ? 'bg-red-500' : 'bg-gray-500'}
                radius="xl"
                size="md"
                styles={{ root: { paddingRight: 14, height: 48 } }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인 해주세요')
                    router.push('/auth/login')
                    return
                  }
                  mutate(String(productId))
                }}
              >
                찜하기
              </Button>
            </div>
            <Button
              className="bg-black"
              radius="xl"
              size="md"
              styles={{ root: { paddingRight: 14, height: 48 } }}
              onClick={() => {
                if (session == null) {
                  alert('로그인 해주세요')
                  router.push('/auth/login')
                  return
                }
                validate('order')
              }}
            >
              구매하기
            </Button>
            <div className="text-sm text-zinc-300">
              등록일자 {format(new Date(product.createdAt), 'yyyy년 M월 d일')}
            </div>
          </div>
        </div>
      ) : (
        <div> 로딩중 </div>
      )}
    </>
  )
}
