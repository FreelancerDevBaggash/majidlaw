// import type React from "react"
// import type { Metadata } from "next"
// import { Inter, Amiri } from "next/font/google"
// import { Suspense } from "react"
// import "./globals.css"

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// })

// const amiri = Amiri({
//   subsets: ["arabic"],
//   weight: ["400", "700"],
//   variable: "--font-amiri",
//   display: "swap",
// })

// export const metadata: Metadata = {
//   title: "المحامي ماجد المصعبي - مكتب المحاماة والاستشارات القانونية",
//   description:
//     "مكتب المحامي ماجد غالب المصعبي للمحاماة والاستشارات القانونية - خبرة أكثر من 20 عامًا في القانون المدني والتجاري",
//   generator: "By Ahmed , Ebrahim",
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="ar" dir="rtl">
//       <body className={`${inter.variable} ${amiri.variable} font-arabic antialiased`}>
//         <Suspense fallback={null}>{children}</Suspense>
//       </body>
//     </html>
//   )
// }

import type React from "react"
import type { Metadata } from "next"
import { Inter, Amiri } from "next/font/google"
import { Suspense } from "react"
import Script from "next/script"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
})

export const metadata: Metadata = {
  title: "المحامي ماجد المصعبي - مكتب المحاماة والاستشارات القانونية",
  description:
    "مكتب المحامي ماجد غالب المصعبي للمحاماة والاستشارات القانونية - خبرة أكثر من 20 عامًا في القانون المدني والتجاري والجنائي والأحوال الشخصية.",
  keywords: [
    "محامي",
    "المحامي ماجد المصعبي",
    "استشارات قانونية",
    "محامي تجاري",
    "محامي مدني",
    "محامي جنائي",
    "محامي أحوال شخصية",
    "مكتب محاماة اليمن",
  ],
  generator: "By Ahmed, Ebrahim",
  authors: [{ name: "المحامي ماجد المصعبي" }],
  openGraph: {
    title: "المحامي ماجد المصعبي - مكتب المحاماة والاستشارات القانونية",
    description:
      "خدمات قانونية متكاملة مع خبرة أكثر من 20 عامًا في القانون المدني والتجاري والجنائي.",
    url: "https://majidlaw.vercel.app", // استبدل برابط مشروعك
    siteName: "مكتب المحامي ماجد المصعبي",
    images: [
      {
        url: "https://majidlaw.vercel.app/og-image.jpg", // ضع صورة مناسبة
        width: 1200,
        height: 630,
        alt: "المحامي ماجد المصعبي",
      },
    ],
    locale: "ar_YE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "المحامي ماجد المصعبي",
    description: "مكتب المحاماة والاستشارات القانونية - خبرة أكثر من 20 عامًا.",
    images: ["https://majidlaw.vercel.app/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://majidlaw.vercel.app",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* ✅ JSON-LD Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LegalService",
              name: "مكتب المحامي ماجد المصعبي",
              image: "https://majidlaw.vercel.app/og-image.jpg",
              url: "https://majidlaw.vercel.app",
              logo: "https://majidlaw.vercel.app/logo.png",
              description:
                "مكتب المحامي ماجد غالب المصعبي للمحاماة والاستشارات القانونية - خبرة أكثر من 20 عامًا في القانون المدني والتجاري والجنائي والأحوال الشخصية.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "شارع القيادة - صنعاء",
                addressLocality: "صنعاء",
                addressCountry: "اليمن",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+967-7-1234567",
                contactType: "customer service",
                areaServed: "YE",
                availableLanguage: ["ar"],
              },
              sameAs: [
                "https://www.facebook.com/yourpage",
                "https://www.twitter.com/yourpage",
                "https://www.linkedin.com/in/yourpage",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${amiri.variable} font-arabic antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
