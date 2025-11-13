import "@/styles/style.scss";
import Panchang from "./fonts";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Subsonic Catering",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={Panchang.variable}>
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
