import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
 import packageData from '../package.json'

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
        <div className="pill z-50 text-gray-500 absolute bottom-0 right-0 m-4 ">
          v{packageData.version}
        </div>
      </body>
    </html>
  );
}
