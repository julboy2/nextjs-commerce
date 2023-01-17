// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getProduts(skip: number, take: number, category: number) {
  const where =
    category && category !== -1
      ? {
          where: { category_id: category },
        }
      : undefined
  try {
    const response = await prisma.products.findMany({
      skip,
      take,
      ...where,
      orderBy: { price: 'asc' },
    })

    //console.log(response)
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
  const { skip, take, category } = req.query

  if (skip == null || take == null) {
    res.status(400).json({ message: 'no skip' })
    return
  }

  try {
    const products = await getProduts(
      Number(skip),
      Number(take),
      Number(category)
    )
    res.status(200).json({ items: products, message: `Success` })
  } catch (error) {
    res.status(400).json({ message: `Failed` })
  }
}
