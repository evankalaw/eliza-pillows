import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { ptserif, cinzel } from "@/ui/fonts";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://elizastudios.ai"),
  title: "SLEEP WITH ELIZA",
  description:
    "The Sleeper Agent body pillow that lures you in and hacks your dreams. Rare drop. No regrets.",
  openGraph: {
    title: "SLEEP WITH ELIZA",
    description:
      "The Sleeper Agent body pillow that lures you in and hacks your dreams. Rare drop. No regrets.",
    images: ["/meta.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SLEEP WITH ELIZA",
    description:
      "The Sleeper Agent body pillow that lures you in and hacks your dreams. Rare drop. No regrets.",
    images: ["/meta.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ptserif.variable} ${cinzel.variable} antialiased`}
      >
        <div className="h-screen w-screen">
          {/* <BorderWrappedComponent>
            <PillowSiteNav />
            <main className="h-full">{children}</main>
          </BorderWrappedComponent> */}
          <Providers>
            <main className="h-full">{children}</main>
          </Providers>
        </div>
      </body>
    </html>
  );
}
