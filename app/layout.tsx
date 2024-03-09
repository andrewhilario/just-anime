import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "@/providers/TanstackQueryProvider";

const plus_jakarta_sans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Just Anime",
  description: "Just Anime is a website to watch anime for free."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plus_jakarta_sans.className}>
        <TanstackProvider>{children}</TanstackProvider>
      </body>
    </html>
  );
}
