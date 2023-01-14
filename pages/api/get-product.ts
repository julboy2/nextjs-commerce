// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getProduct(id: number) {
  try {
    const response = await prisma.products.findUnique({
      where: {
        id,
      },
    })
    console.log('ok')
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
  const { id } = req.query
  if (id == null) {
    res.status(400).json({ message: 'no id' })
    return
  }
  try {
    const product = await getProduct(Number(id))
    res.status(200).json({ items: product, message: `Success` })
  } catch (error) {
    res.status(400).json({ message: `Failed` })
  }
}
