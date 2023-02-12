import { CountControl } from '@components/CountControl'
import styled from '@emotion/styled'
import { Button } from '@mantine/core'
import { Cart, products } from '@prisma/client'
import { IconOld, IconRefresh, IconX } from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CATEGORY_MAP } from 'constants/products'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

interface CartItem extends Cart {
  name: string
  price: number
  image_url: string
}

export const CART_QUERY_KEY = '/api/get-cart'

export default function CartPage() {
  const router = useRouter()

  const { data } = useQuery<{ items: CartItem[] }, unknown, CartItem[]>(
    [CART_QUERY_KEY],
    () =>
      fetch(CART_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items)
    // {
    //   select: (data) => data.items,
    // }
  )

  const deliveryAmount = data && data.length > 0 ? 5000 : 0
  const discountAmount = 0

  const amount = useMemo(() => {
    if (data == null) {
      return 0
    }
    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0)
  }, [data])

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[] // prisma 에서 가져옴
  >(
    [`/api/get-products?skip=0&take=3`],
    () => fetch(`/api/get-products?skip=0&take=3`).then((res) => res.json()),
    {
      select: (data) => data.items,
    }
  )

  const handleOrder = () => {
    //todo  주문하기 기능구현
    alert(`장바구니에 담긴 것들 ${JSON.stringify(data)} 구현`)
  }

  return (
    <div style={{ width: '600px' }}>
      <span>cart {data ? data.length : 0}</span>
      <div className="flex ">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data ? (
            data.length > 0 ? (
              data.map((item, idx) => <Item key={idx} {...item} />)
            ) : (
              <div>장바구니에 아무것도 없습니다.</div>
            )
          ) : (
            <div>불러오는중...</div>
          )}
        </div>
        <div className="px-4">
          <div
            className="flex flex-col p-4 space-y-4"
            style={{ border: '1px solid grey' }}
          >
            <div>Info</div>
            <Row>
              <span>금액</span>
              <span>{amount} 원</span>
            </Row>
            <Row>
              <span>배송비</span>
              <span>{deliveryAmount} 원</span>
            </Row>
            <Row>
              <span>할인금액</span>
              <span>{discountAmount} 원</span>
            </Row>
            <Row>
              <span className="font-semibold">결제금액</span>
              <span className="font-semibold text-red-700">
                {(amount + deliveryAmount + discountAmount).toLocaleString(
                  'ko-kr'
                )}
                원
              </span>
            </Row>
            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{ root: { height: 48 } }}
              onClick={handleOrder}
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <p>추천상품</p>
        {products && (
          <div className="gird grid-cols-3 gap-3">
            {products.map((item) => (
              <div
                key={item.id}
                style={{ maxWidth: 300 }}
                onClick={() => router.push(`/products/${item.id}`)}
              >
                <Image
                  className="rounded-2xl"
                  src={item.image_url ?? ''}
                  width={300}
                  height={200}
                  alt={item.name}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8HyBYDwAFVwHR7ElIRgAAAABJRU5ErkJggg=="
                />
                <div className="flex">
                  <span>{item.name}</span>
                  <span className="m-auto">
                    {item.price.toLocaleString('ko-KR')} 원
                  </span>
                </div>
                <span className="text-zinc-400">
                  {CATEGORY_MAP[item.category_id - 1]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Item = (props: CartItem) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity)

  const [amount, setAmount] = useState<number>(props.quantity)
  useEffect(() => {
    if (quantity != null) {
      setAmount(quantity * props.price)
    }
  }, [quantity, props.price])

  const { mutate: updateCart } = useMutation<unknown, unknown, Cart, any>(
    (item) =>
      fetch('/api/update-cart', {
        method: 'post',
        body: JSON.stringify({ item }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (item) => {
        await queryClient.cancelQueries([CART_QUERY_KEY])

        const previous = queryClient.getQueryData([CART_QUERY_KEY])

        queryClient.setQueriesData<Cart[]>([CART_QUERY_KEY], (old) =>
          old?.filter((c) => c.id !== item.id).concat(item)
        )

        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueriesData([CART_QUERY_KEY], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY])
      },
    }
  )

  const { mutate: deleteCart } = useMutation<unknown, unknown, number, any>(
    (id) =>
      fetch('/api/delete-cart', {
        method: 'post',
        body: JSON.stringify({ id }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries([CART_QUERY_KEY])

        const previous = queryClient.getQueryData([CART_QUERY_KEY])

        queryClient.setQueriesData<Cart[]>([CART_QUERY_KEY], (old) =>
          old?.filter((c) => c.id !== id)
        )

        return { previous }
      },
      onError: (error, _, context) => {
        queryClient.setQueriesData([CART_QUERY_KEY], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([CART_QUERY_KEY])
      },
    }
  )

  const handleUpdate = () => {
    if (quantity == null) {
      alert('최소수량을 입력하세요')
      return
    }
    updateCart({ ...props, quantity, amount: props.price * quantity })
  }

  const handleDelete = async () => {
    await deleteCart(props.id)
    alert(`장바구니에서 ${props.name} 삭제`)
  }

  // const amount = useMemo(() => {
  //   if (quantity != null) {
  //     return quantity * props.price
  //   }
  // }, [quantity, props.price])

  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image
        src={props.image_url}
        width={155}
        height={195}
        alt={props.name}
        onClick={() => router.push(`/products/${props.productId}`)}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="mb-auto">
          가격 {props.price.toLocaleString('ko-kr')}
        </span>
        <div className="flex items-center space-x-4">
          <CountControl value={quantity} setValue={setQuantity} max={20} />
          <IconRefresh onClick={handleUpdate} />
        </div>
      </div>
      <div>
        <span>{amount.toLocaleString('ko-kr')}</span>
        <IconX onClick={handleDelete} />
      </div>
    </div>
  )
}

// 한줄에 두개의 컴포넌트가 있다면 두번째 컴포넌트만 위치변경
const Row = styled.div`
  display: flex;
  * ~ * {
    margin-left: auth;
  }
`
