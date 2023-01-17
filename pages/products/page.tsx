import { products } from '@prisma/client'
import Image from 'next/image'
import React, { SetStateAction, useCallback, useEffect, useState } from 'react'
import { Input, Pagination, SegmentedControl, Select } from '@mantine/core'
import { CATEGORY_MAP, FILTERS, TAKE } from 'constants/products'
import { IconSearch } from '@tabler/icons'

export default function Products() {
  const [activePage, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState<string>('-1')
  const [products, setProducts] = useState<products[]>([])
  const [selectFilter, setSelectFilter] = useState<string | null>(
    FILTERS[0].value
  )
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    fetch(`/api/get-categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data.items))
  }, [])

  useEffect(() => {
    fetch(
      `/api/get-products-count?category=${selectedCategory}&contains=${keyword}`
    )
      .then((res) => res.json())
      .then((data) => setTotal(Math.ceil(data.items / TAKE)))
  }, [selectedCategory, keyword])

  useEffect(() => {
    const skip = TAKE * (activePage - 1)
    fetch(
      `/api/get-products?skip=${skip}&take=${TAKE}&category=${selectedCategory}&orderBy=${selectFilter}&contains=${keyword}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data.items))
  }, [activePage, selectedCategory, selectFilter, keyword])

  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  return (
    <div className="px-32 mt-32 mb-32">
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
            <div key={item.id} style={{ maxWidth: 300 }}>
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
        <Pagination
          className="m-auto"
          page={activePage}
          onChange={setPage}
          total={total}
        />
      </div>
    </div>
  )
}
