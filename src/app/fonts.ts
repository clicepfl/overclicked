import localFont from "next/font/local";

const Panchang = localFont({
  src: [
    {
      path: "../../public/fonts/Panchang-Extralight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Panchang-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Panchang-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Panchang-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Panchang-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Panchang-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Panchang-Extrabold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Panchang-Variable.woff2",
      weight: "200 800",
      style: "normal",
    },
  ],
  variable: "--font-panchang",
});

export default Panchang;
