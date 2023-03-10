import { products } from '@prisma/client'
import { TAKE } from 'constants/products'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export default function Products() {
  const [skip, setSkip] = useState(0)
  const [products, setProducts] = useState<products[]>([])

  useEffect(() => {
    fetch(`/api/get-products?skip=0&take=${TAKE}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.items))
  }, [])

  //특정 변수가 바뀔때마다
  //함수가 새로 생성되길 원해서 useCallback  사용
  const getProducts = useCallback(() => {
    const next = skip + TAKE
    fetch(`/api/get-products?skip=${next}&take=${TAKE}`)
      .then((res) => res.json())
      .then((data) => {
        const list = products.concat(data.items)
        setProducts(list)
      })
    setSkip(next)
  }, [skip, products])

  return (
    <div className="px-32 mt-32 mb-32">
      {products && (
        <div className="gird grid-cols-3 gap-3">
          {products.map((item) => (
            <div key={item.id}>
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
                {item.category_id === 1 && '의류'}
              </span>
            </div>
          ))}
        </div>
      )}
      <div
        className="w-full rounded mt-20 bg-zinc-200 p-4 "
        onClick={getProducts}
      >
        더보기
      </div>
    </div>
  )
}
