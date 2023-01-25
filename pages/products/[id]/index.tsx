import Carousel from 'nuka-carousel/lib/carousel'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Head from 'next/head'
import CustomEditor from '@components/Editor'
import { useRouter } from 'next/router'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { GetServerSidePropsContext } from 'next'
import { products } from '@prisma/client'
import { format } from 'date-fns'
import { CATEGORY_MAP } from 'constants/products'

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

export default function Products(props: {
  product: products & { images: string[] }
}) {
  const [index, setIndex] = useState(0)
  const router = useRouter()
  const { id: productId } = router.query
  const [editorState] = useState<EditorState | undefined>(() =>
    props.product.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.product.contents))
        )
      : EditorState.createEmpty()
  )

  const product = props.product

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
        <div className="p-24 flex flex-row">
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
