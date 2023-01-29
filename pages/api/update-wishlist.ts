import { getOrderBy } from '../../constants/products'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { stringify } from 'querystring'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function updateWishlist(userId: string, productId: string) {
  try {
    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId,
      },
    })

    const originWishlist =
      wishlist?.productIds != null && wishlist.productIds !== ''
        ? wishlist.productIds.split(',')
        : []

    const isWished = originWishlist.includes(productId)

    // productId 가 있으면 productId 제외하고 호출한다.
    // productId 가 없으면 추가한다.
    const newWished = isWished
      ? originWishlist.filter((id) => id !== productId)
      : [...originWishlist, productId]

    const response = await prisma.wishlist.upsert({
      where: {
        userId,
      },
      update: {
        productIds: newWished.join(','),
      },
      create: {
        userId,
        productIds: newWished.join(','),
      },
    })

    console.log(response)

    //  테이터를 '1,2,3' 으로 string 형식으로 저장되어있다.
    return response?.productIds.split(',')
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
  const { productId } = JSON.parse(req.body) // post 요청이라 req.body  에서 불러옴
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await updateWishlist(
      String(session?.id),
      String(productId)
    )
    res.status(200).json({ items: wishlist, message: `Success` })
  } catch (error) {
    res.status(400).json({ message: `Failed` })
  }
}
