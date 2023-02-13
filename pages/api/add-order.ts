import { unstable_getServerSession } from 'next-auth'
import { PrismaClient, OrderItem } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function addOrder(
  userId: string,
  items: Omit<OrderItem, 'id'>[],
  orderInfo?: { receiver: string; address: string; phoneNumber: string }
) {
  // prisma 멀티 createMany 를 쓰면 총 count 가 반환이 되서 알고싶은 id 를 못알기때문에
  // create 로 반복문으로 돌린다.

  try {
    let orderItemIds = []
    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          ...item,
        },
      })
      console.log(`Create id : ${orderItem.id}`)
      orderItemIds.push(orderItem.id)
    }

    console.log(JSON.stringify(orderItemIds))

    const response = await prisma.orders.create({
      data: {
        userId,
        orderItemIds: orderItemIds.join(','),
        ...orderInfo,
        status: 0,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { items, orderInfo } = JSON.parse(req.body)
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
  }

  try {
    const orderList = await addOrder(String(session?.id), items, orderInfo)
    res.status(200).json({ items: orderList, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
