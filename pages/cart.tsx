import { CountControl } from '@components/CountControl'
import styled from '@emotion/styled'
import { IconRefresh, IconX } from '@tabler/icons'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

interface CartItem {
  name: string
  productId: number
  price: number
  quantity: number
  amount: number
  image_url: string
}

export default function Cart() {
  const [data, setData] = useState<CartItem[]>([])

  const deliveryAmount = 5000
  const discountAmount = 0

  const amount = useMemo(() => {
    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0)
  }, [data])

  useEffect(() => {
    const mockData = [
      {
        name: '곰',
        productId: 100,
        price: 10000,
        quantity: 2,
        amount: 20000,
        image_url: 'https://picsum.photos/id/1020/1000/600/',
      },
      {
        name: '바다괴물',
        productId: 84,
        price: 25000,
        quantity: 1,
        amount: 25000,
        image_url: 'https://picsum.photos/id/1084/1000/600/',
      },
    ]

    setData(mockData)
  }, [])

  return (
    <div>
      <span>cart {data.length}</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data.map((item, idx) => (
            <Item key={idx} {...item} />
          ))}
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
                )}{' '}
                원
              </span>
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}

const Item = (props: CartItem) => {
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity)

  const [amount, setAmount] = useState<number>(props.quantity)
  useEffect(() => {
    if (quantity != null) {
      setAmount(quantity * props.price)
    }
  }, [quantity, props.price])

  // const amount = useMemo(() => {
  //   if (quantity != null) {
  //     return quantity * props.price
  //   }
  // }, [quantity, props.price])

  return (
    <div className="w-full flex p-4">
      <Image src={props.image_url} width={155} height={195} alt={props.name} />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="mb-auto">
          가격 {props.price.toLocaleString('ko-kr')}
        </span>
        <div className="flex items-center space-x-4">
          <CountControl value={quantity} setValue={setQuantity} max={20} />
          <IconRefresh />
        </div>
      </div>
      <div>
        <span>{amount.toLocaleString('ko-kr')}</span>
        <IconX />
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
