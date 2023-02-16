import { CountControl } from '@components/CountControl'
import styled from '@emotion/styled'
import { Badge, Button } from '@mantine/core'
import { Cart, OrderItem, Orders, products } from '@prisma/client'
import { IconOld, IconRefresh, IconX } from '@tabler/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CATEGORY_MAP } from 'constants/products'
import { format } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

interface OrderItemDetail extends OrderItem {
  name: string
  image_url: string
}

interface OrderDetail extends Orders {
  orderItems: OrderItemDetail[]
}

const ORDER_STATUS_MAP = [
  '주문취소',
  '주문대기',
  '결제대기',
  '결제완료',
  '배송대기',
  '배송중',
  '배송완료',
  '환불대기',
  '환불완료',
  '반품대기',
  '반품완료',
]

export const ORDER_QUERY_KEY = '/api/get-order'

export default function MyPage() {
  const router = useRouter()

  const { data } = useQuery<{ items: OrderDetail[] }, unknown, OrderDetail[]>(
    [ORDER_QUERY_KEY],
    () =>
      fetch(ORDER_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items)
    // {
    //   select: (data) => data.items,
    // }
  )

  return (
    <div style={{ width: '600px' }}>
      <span>주문내역 {data ? data.length : 0}</span>
      <div className="flex ">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data ? (
            data.length > 0 ? (
              data.map((item, idx) => <DetailItem key={idx} {...item} />)
            ) : (
              <div>주문내역이 아무것도 없습니다.</div>
            )
          ) : (
            <div>불러오는중...</div>
          )}
        </div>
      </div>
    </div>
  )
}

const DetailItem = (props: OrderDetail) => {
  const queryClient = useQueryClient()
  const { mutate: updateOrderStatus } = useMutation<
    unknown,
    unknown,
    number,
    any
  >(
    (status) =>
      fetch('/api/update-order-status', {
        method: 'post',
        body: JSON.stringify({ id: props.id, status, userId: props.userId }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: async (status) => {
        // 전체적인내용 Optimistic updates : 요청시 성공을 했을거라고

        //1. 만약WITHLIST_QUERY_KEY 해당키로 다른작업중이면 작업 중지함
        await queryClient.cancelQueries([ORDER_QUERY_KEY])

        //2. 수정전의 현재 값을 가져옴
        const previous = queryClient.getQueryData([ORDER_QUERY_KEY])

        //3. 성공했다는 가정하에 해당 값을 먼저 조작한다.
        //3.1 먼저 데이터를 조작하는 이유는 화면(버튼)에 딜레이가 생기는 것을 방지
        //3.2 화면(버튼) 이먼저 성공한것처럼 변하고 다음에 데이터가 수정된다.
        queryClient.setQueriesData<Cart[]>([ORDER_QUERY_KEY], (old) =>
          old?.map((c) => {
            if (c.id === props.id) {
              return { ...c, status }
            }
            return c
          })
        )

        return { previous }
      },
      onError: (error, _, context) => {
        // 에러일경우 위에 2의 previous 를 가져온다.
        queryClient.setQueriesData([ORDER_QUERY_KEY], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([ORDER_QUERY_KEY])
      },
    }
  )

  const handlePaymenmt = () => {
    updateOrderStatus(5)
  }

  const handleCancel = () => {
    updateOrderStatus(-1)
  }
  return (
    <div
      className="w-full flex flex-col p-4 rounded-md"
      style={{ border: '1px solid grey' }}
    >
      <div className="flex">
        <Badge color={props.status < 1 ? 'red' : ''} className="mb-2">
          {ORDER_STATUS_MAP[props.status + 1]}
        </Badge>
        <IconX className="ml-auto" onClick={handleCancel} />
      </div>

      {props.orderItems.map((orderItem, idx) => (
        <Item key={idx} {...orderItem} status={props.status} />
      ))}
      <div className="flex mt-4">
        <div className="flex flex-col">
          <span className="mb-2">주문정보</span>
          <span>받는사람 : {props.receiver ?? '입력필요'} </span>
          <span>주소 : {props.address ?? '입력필요'} </span>
          <span>연락처 : {props.phoneNumber ?? '입력필요'} </span>
        </div>
        <div className="flex flex-col ml-auto mr-4 text-right">
          <span className="font-semibold mb-2">
            합계금액{' '}
            <span className="text-red-500">
              {props.orderItems
                .map((item) => item.amount)
                .reduce((prev, curr) => prev + curr, 0)
                .toLocaleString('ko-kr')}{' '}
              원
            </span>
          </span>
          <span className="text-zinc-400 mt-auto mb-auto">
            주문일자 :{' '}
            {format(new Date(props.createAt), 'yyyy년 M월 d일 HH:mm:ss')}
          </span>
          <Button
            style={{ backgroundColor: 'black', color: 'white' }}
            onClick={handlePaymenmt}
          >
            결제처리
          </Button>
        </div>
      </div>
    </div>
  )
}

const Item = (props: OrderItemDetail & { status: number }) => {
  const router = useRouter()
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity)
  const [amount, setAmount] = useState<number>(props.quantity)
  useEffect(() => {
    if (quantity != null) {
      setAmount(quantity * props.price)
    }
  }, [quantity, props.price])

  const handleComment = () => {
    router.push(`/comment/edit?orderItemId=${props.id}`)
  }

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
        </div>
      </div>
      <div className="flex flex-col ml-auto space-x-4">
        <span>{amount.toLocaleString('ko-kr')}</span>
        {props.status === 5 && (
          <Button
            style={{
              backgroundColor: 'black',
              color: 'white',
              marginTop: 'auto',
            }}
            onClick={handleComment}
          >
            후기작성
          </Button>
        )}
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
