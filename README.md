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

planet scale

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

yadn add -D @types/react-image-gallery



yarn add nuka-carousel



next-sitemap

yarn add -D next-sitemap

파일생성

next-sitemap.config.js

module.exports={

siteUrl : [ 블로그 url],

generateRobotsTxt:grue,

}


package.json

script추가

'postbuild' : 'next-sitemap'


날짜 convert

yarn add date-fns


에디터

draft.js 기반 react-draft-wysiwyg 

yarn add draft-js react-draft-wysiwyg

yarn add -D @types/draft-js @types/react-draft-wysiwyg



데이터 임의생성위해

yarn add -D ts-node


설정 추가 tsconfig.js

"ts-node": {
    "compilerOptions": {
      "module": "CommonJS",
      "types": ["node"]
    }
  }


실행

yarn ts-node prisma/product.ts // ts-node 뒤에 경로




페이징 및 아이콘 컴포넌트 위해설치

yarn add @mantine/core @mantine/hooks

yarn add @tabler/icons


https://mantine.dev/core/pagination/



React-query 사용
tanstack


yarn add @tanstack/react-query


구글 oauth 사용

yarn add @react-oauth/google@latest

yarn add jwt-decode


로그인 

next-auth 를 prisma 를 연결해서사용한다.


yarn add next-auth @next-auth/prisma-adapter

yarn add prisma --dev

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


테이블생성

1. prisma/schema.prisma 에서  

model user {테이블생성후}

2. https://app.planetscale.com/  접속후 새 branch 생성후 connect 주소를 .env 에 적는다. 

3. yarn prisma db push 하면 
prisma/schema.prisma 에서 만들었던 테이블이 planetscale 에 생성된다.

3-1. db 에 있는 스키마를 prisma 파일로 가져오려면

> yarn prisma db pull --schema=./prisma/파일명.prisma


TailwindCSS

https://tailwindcss.com/docs/guides/nextjs



##로그인
https://next-auth.js.org


prisma 로 db 통신을 하고 있다.

next-auth 도 prisma 로 연결해서 사용한다.



## react-query 기능
1. 업데이트한 내역이 바로 반영될 수 있도록 하기 

Optimistic updates : 요청시 성공을 했을거라고 예측하고 화면을 업데이트한다.

(https://tanstack.com/query/v4/docs/guides/optimistic-updates)


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
