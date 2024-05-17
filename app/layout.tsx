import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
 import packageData from '../package.json'
import Email from "./Icons/Email"

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flens",
  description: "Track your macros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        {children}
        <a href="https://omshejul.com/qr/" className="pill z-50 border rounded-full border-[hsla(0,0%,50%,0.5)] p-2 text-gray-500 absolute bottom-0 left-0 m-4 ">
          <Email />
        </a>
        <div className="pill z-50 text-gray-500 absolute bottom-0 right-0 m-4 ">
          v{packageData.version}
        </div>
      </body>
    </html>
  );
}
