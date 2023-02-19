import { unstable_getServerSession } from 'next-auth'
import { PrismaClient, OrderItem } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getComments(productId: number) {
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId,
      },
    })

    console.log(orderItems)

    let response = []

    // orderItemId 를 기반을 Comment 를 조회한다.
    for (const orderItem of orderItems) {
      const res = await prisma.comment.findUnique({
        where: {
          orderItemId: orderItem.id,
        },
      })
      response.push({ ...orderItem, ...res })
    }

    return response
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
  const { productId } = req.query

  if (productId == null) {
    return res.status(200).json({ items: [], message: 'no productId' })
  }
  try {
    const orderList = await getComments(Number(productId))
    res.status(200).json({ items: orderList, message: 'Success' })
  } catch (error) {
    res.status(400).json({ message: 'Failed' })
  }
}
