import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const productData: Prisma.productsCreateInput[] = Array.apply(
  null,
  Array(100)
).map((_, index) => ({
  name: `Darn Jean ${index + 1}`,
  contents: `{"blocks":[{"key":"6jc8o","text":"this is a \nDark jean ${
    index + 1
  } ","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":11,"length":9,"style":"color-rgb(250,250,250)"},{"offset":11,"length":9,"style":"bgcolor-rgb(17,17,17)"},{"offset":11,"length":9,"style":"fontsize-14"},{"offset":11,"length":9,"style":"fontfamily-Roboto Mono\", ui-monospace, SF-Regular, \"SF Mono\", Menlo, Consolas, \"Liberation Mono\", monospace"}],"entityRanges":[],"data":{}}],"entityMap":{}}`,
  category_id: 1,
  image_url: `https://picsum.photos/id/10${
    (index + 1) % 20 === 0 ? 20 : index + 1
  }/1000/600/`,
  price: Math.floor(Math.random() * (100000 - 20000) + 20000),
}))

async function main() {
  await prisma.products.deleteMany({})

  for (const p of productData) {
    const product = await prisma.products.create({
      data: p,
    })

    console.log(`Created id : ${product.id}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })
