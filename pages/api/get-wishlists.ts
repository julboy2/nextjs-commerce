import { getOrderBy } from '../../constants/products'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { stringify } from 'querystring'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getWishlists(userId: string) {
  try {
    const withlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    })

    //  테이터를 '1,2,3' 으로 string 형식으로 저장되어있다.
    const productId = withlist?.productIds
      .split(',')
      .map((item) => Number(item))

    if (productId && productId.length > 0) {
      const response = await prisma.products.findMany({
        where: {
          id: {
            in: productId,
          },
        },
      })
      console.log(response)
      return response
    }

    return []
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
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await getWishlists(String(session?.id))
    res.status(200).json({ items: wishlist, message: `Success` })
  } catch (error) {
    res.status(400).json({ message: `Failed` })
  }
}
