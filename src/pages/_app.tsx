import "@/styles/globals.css";
import type { AppProps } from "next/app";
import localFont from "next/font/local";

const FontOddval = localFont({ src: "../../public/fonts/oddval.woff" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${FontOddval.className}`}>
      <Component {...pageProps} />
    </main>
  );
}
