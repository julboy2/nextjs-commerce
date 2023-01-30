import { categories, products } from '@prisma/client'
import Image from 'next/image'
import React, { SetStateAction, useCallback, useEffect, useState } from 'react'
import { Input, Pagination, SegmentedControl, Select } from '@mantine/core'
import { CATEGORY_MAP, FILTERS, TAKE } from 'constants/products'
import { IconSearch } from '@tabler/icons'
import useDebounce from 'hooks/useDebounce'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const { data: session } = useSession()
  const [activePage, setPage] = useState(1)
  // react-query 사용위해 주석처리
  //const [total, setTotal] = useState(0)
  //const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<string>('-1')
  // react-query 사용위해 주석처리
  //const [products, setProducts] = useState<products[]>([])
  const [selectFilter, setSelectFilter] = useState<string | null>(
    FILTERS[0].value
  )
  const [keyword, setKeyword] = useState('')

  // 검색을 키보드를 칠때가아닌 0.6 초 delay 를 준다
  const debouncedKeyword = useDebounce<string>(keyword)

  // useEffect(() => {
  //   fetch(`/api/get-categories`)
  //     .then((res) => res.json())
  //     .then((data) => setCategories(data.items))
  // }, [])

  const { data: categories } = useQuery<
    { items: categories[] },
    unknown,
    categories[]
  >(
    [`/api/get-categories`],
    () => fetch(`/api/get-categories`).then((res) => res.json()),
    { select: (data) => data.items }
  )

  // react-query 로 cache 를 사용하기위해 주석처리
  // useEffect(() => {
  //   fetch(
  //     `/api/get-products-count?category=${selectedCategory}&contains=${debouncedKeyword}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setTotal(Math.ceil(data.items / TAKE)))
  // }, [selectedCategory, debouncedKeyword])

  const { data: total } = useQuery(
    [
      `/api/get-products-count?category=${selectedCategory}&contains=${debouncedKeyword}`,
    ],
    () =>
      fetch(
        `/api/get-products-count?category=${selectedCategory}&contains=${debouncedKeyword}`
      )
        .then((res) => res.json())
        .then((data) => Math.ceil(data.items / TAKE))
    // select를 쓰지 않고  fetch  에서 값을 넘김
  )

  // react-query 로 cache 를 사용하기위해 주석처리
  // useEffect(() => {
  //   const skip = TAKE * (activePage - 1)
  //   fetch(
  //     `/api/get-products?skip=${skip}&take=${TAKE}&category=${selectedCategory}&orderBy=${selectFilter}&contains=${debouncedKeyword}`
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data.items))
  // }, [activePage, selectedCategory, selectFilter, debouncedKeyword])

  // 한번조회했던 값들을 다시 조회하지 않고 사용
  // 브라우저 네트워크에서 보면 동일한 값으로 호출한/api/get-products 는 다시 호출하지 않는다.
  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[] // prisma 에서 가져옴
  >(
    [
      `/api/get-products?skip=${
        TAKE * (activePage - 1)
      }&take=${TAKE}&category=${selectedCategory}&orderBy=${selectFilter}&contains=${debouncedKeyword}`,
    ],
    () =>
      fetch(
        `/api/get-products?skip=${
          TAKE * (activePage - 1)
        }&take=${TAKE}&category=${selectedCategory}&orderBy=${selectFilter}&contains=${debouncedKeyword}`
      ).then((res) => res.json()),
    {
      select: (data) => data.items,
    }
  )

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  return (
    <div className="mt-32 mb-32">
      <div className="mb-4">
        <Input
          icon={<IconSearch />}
          placeholder="Search"
          onChange={handlerChange}
        />
      </div>
      <div className="mb-4">
        <Select
          value={selectFilter}
          onChange={setSelectFilter}
          data={FILTERS}
        />
      </div>
      {categories && (
        <div className="mb-4">
          <SegmentedControl
            value={selectedCategory}
            onChange={setSelectedCategory}
            data={[
              { label: 'ALL', value: '-1' },
              ...categories.map((cate) => ({
                label: cate.name,
                value: String(cate.id),
              })),
            ]}
            color="dark"
          />
        </div>
      )}
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
      <div className="w-full flex mt-5">
        {total && (
          <Pagination
            className="m-auto"
            page={activePage}
            onChange={setPage}
            total={total}
          />
        )}
      </div>
    </div>
  )
}
