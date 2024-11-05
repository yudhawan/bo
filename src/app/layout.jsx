import localFont from "next/font/local";
import "./globals.scss";
import MainApp from "@/constant/MainApp";
import { Suspense } from "react";

const azFont = localFont({
  src: [
    {
      path: "../fonts/AvenirNextLTPro-Bold.otf",
      weight: "700",
      style: "bolder",
    },
    {
      path: "../fonts/AvenirNextLTPro-Demi.otf",
      weight: "600",
      style: "bold",
    },
    {
      path: "../fonts/AvenirNextLTPro-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AvenirNextLTPro-Regular.otf",
      weight: "400",
      style: "lighter",
    },
  ],
});
export const metadata = {
  title: "Master Bahasa",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={azFont.className + " bg-[#ffff]"}>
        <Suspense>
        <div className="relative flex">
          <div className="bg-neutral-50 w-full">
              <MainApp>{children}</MainApp>
          </div>
        </div>
        </Suspense>
      </body>
    </html>
  );
}
