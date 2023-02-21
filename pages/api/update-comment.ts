import { getOrderBy } from '../../constants/products'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { stringify } from 'querystring'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function updateComment({
  userId,
  orderItemId,
  rate,
  contents,
  images,
}: {
  userId: string
  orderItemId: number
  rate: number
  contents: string
  images: string
}) {
  try {
    const response = await prisma.comment.upsert({
      where: {
        orderItemId,
      },
      update: {
        contents,
        rate,
        images,
      },
      create: {
        userId,
        orderItemId,
        contents,
        rate,
        images,
      },
    })

    console.log(response)

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
  const session = await unstable_getServerSession(req, res, authOptions)
  const { orderItemId, rate, contents, images } = JSON.parse(req.body) // post 요청이라 req.body  에서 불러옴
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await updateComment({
      userId: String(session?.id),
      orderItemId: orderItemId,
      rate: rate,
      contents: contents,
      images,
    })
    res.status(200).json({ items: wishlist, message: `Success` })
  } catch (error) {
    res.status(400).json({ message: `Failed` })
  }
}
