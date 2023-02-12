import { getOrderBy } from '../../constants/products'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Cart, PrismaClient } from '@prisma/client'
import { stringify } from 'querystring'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

// Omit 이란  <Cart, 'id' | 'userId'> 여기서 Cart 에 있는 model (컬럼) 중에  id와 userID 는 빼겠다
async function deleteCart(id: number) {
  try {
    const response = await prisma.cart.delete({
      where: {
        id,
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
  const { id } = JSON.parse(req.body) // post 요청이라 req.body  에서 불러옴
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await deleteCart(id)
    res.status(200).json({ items: wishlist, message: `Success` })
  } catch (error) {
    res.status(400).json({ message: `Failed` })
  }
}
