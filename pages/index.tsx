import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Button from '@components/Button' // tsconfig.json 파일에"@components/*": ["components/*"] 선언해줘서 사용가능
import { useEffect, useRef, useState } from 'react'
import { css } from '@emotion/react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // const [products, setProducts] = useState<
  //   { id: string; properties: { id: string }[] }[]
  // >([])
  const [products, setProducts] = useState<
    { id: string; name: string[]; createdAt: string }[]
  >([])

  // useEffect(() => {
  //   fetch(`/api/get-items`)
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data.items))
  // }, [])

  useEffect(() => {
    fetch(`/api/get-products`)
      .then((res) => res.json())
      .then((data) => setProducts(data.items))
  }, [])

  const inputRef = useRef<HTMLInputElement>(null)
  const handleClick = () => {
    if (inputRef.current == null || inputRef.current.value == '') {
      alert('name 을 넣어주세요')
      return
    }
    fetch(`/api/add-item?name=${inputRef.current.value}`)
      .then((res) => res.json())
      .then((data) => alert(data.message))
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.tsx</code>
          </p>

          <input
            type="text"
            ref={inputRef}
            placeholder="name"
            className="placeholder:italic placeholder:text-pink-400 block bg-white w-96 border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          />
        </div>
        <button
          css={css`
            background-color: hotpink;
            padding: 16px;
            border-radius: 8px;
          `}
          onClick={handleClick}
        >
          Add Jacket
        </button>
        <Button onClick={handleClick}>Add Jacket2</Button>
        <br />
        <div>
          <>
            <p>Product List</p>
            <br />
            {products &&
              products.map((item) => (
                <div key={item.id}>
                  {item.name}
                  <span>{item.createdAt}</span>
                </div>
              ))}

            {/* {products &&
              products.map((item) => (
                <div key={item.id}>
                  {JSON.stringify(item)}
                  {item.properties &&
                    //properties 는 배일이 아니라 객체이기 때문에  Object 로 컨트롤한다.
                    Object.entries(item.properties).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => {
                          fetch(
                            `/api/get-detail?pageId=${item.id}&propertyId=${value.id}`
                          )
                            .then((res) => res.json())
                            .then((data) => alert(JSON.stringify(data.detail)))
                        }}
                      >
                        {key}
                      </button>
                    ))}
                  <br />
                  <br />
                </div>
              ))} */}
          </>
        </div>
      </main>
    </>
  )
}
