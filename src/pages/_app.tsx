import "@/styles/globals.css"
import type { AppProps } from "next/app"
import localFont from "next/font/local"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"

const FontOddval = localFont({ src: "../../public/fonts/oddval.woff" })

const isProduction = process.env.NODE_ENV === "production"

if (isProduction && typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
  })
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PostHogProvider>
      <main className={`${FontOddval.className}`}>
        <Component {...pageProps} />
      </main>
    </PostHogProvider>
  )
}
