This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev


formatting 관련
- eslint
- prettier 
   yarn add -D prettier


  prettier  설정
  .prettierignore 파일 root 에 생성
  .prettierrc  파일 root 에 생성

DB 설치

prisma 는 Typescript  기반 ORM 이다.

yarn add -D prisma

yarn add @prisma/client

yarn prisma init

yarn prisma generate


Tailwind CSS

yarn add -D tailwindcss postcss autoprefixer

yarn tailwindcss init -p


Emotion (CSS in JS) : css 를 javascript 로 사용할 수 있는 라이브러리

https://emotion.sh/docs/introduction

yarn add @emotion/styled @emotion/react

설정

- next.config.js 설정

compiler: {
    emotion: true,
  },

- tsconfig.json 설정

"types": ["@emotion/react/types/css-prop"]



yarn add react-image-gallery


```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More Modules
DB
https://planetscale.com/

DB NAME : commerce_database

튜토리얼
https://docs.planetscale.com/docs/tutorials/planetscale-quick-start-guide


TailwindCSS

https://tailwindcss.com/docs/guides/nextjs


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
