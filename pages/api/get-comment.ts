import { getOrderBy } from '../../constants/products'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { stringify } from 'querystring'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getComment(userId: string, orderItemId: number) {
  try {
    const response = await prisma.comment.findUnique({
      where: {
        orderitemId: orderItemId,
      },
    })

    console.log(response)

    if (userId === response?.userId) {
      return response
    }

    return { message: 'userId is not matched' }
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
  const { orderItemId } = req.query

  const session = await unstable_getServerSession(req, res, authOptions)
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  if (orderItemId == null) {
    res.status(200).json({ items: [], message: 'no orderItemId' })
  }

  try {
    const comment = await getComment(String(session?.id), Number(orderItemId))
    res.status(200).json({ items: comment, message: `Success` })
  } catch (error) {
    res.status(400).json({ message: `Failed` })
  }
}
