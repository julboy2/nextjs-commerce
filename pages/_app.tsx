import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import { CLIENT_ID } from 'constants/googleAuth'
import { SessionProvider } from 'next-auth/react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity },
    },
  })
  return (
    // <GoogleOAuthProvider clientId={CLIENT_ID}>
    //   <QueryClientProvider client={queryClient}>
    //     <Component {...pageProps} />
    //   </QueryClientProvider>
    // </GoogleOAuthProvider>

    // 로그인관리는 google Auth  가 아니라 next-auth 에서 제공하는 next auth 사용
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  )
}
