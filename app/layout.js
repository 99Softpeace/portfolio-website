import { Plus_Jakarta_Sans, Sora } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata = {
  title: "Peace Olowosagba | Portfolio",
  description:
    "Fullstack portfolio focused on polished product design, frontend engineering, and scalable backend delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${plusJakartaSans.variable} ${sora.variable}`}>{children}</body>
    </html>
  );
}
