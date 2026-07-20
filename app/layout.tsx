import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "shrt.io — URL Shortener",
  description:
    "Rút gọn link nhanh chóng, không quảng cáo, không theo dõi. Mã ngắn được lưu cục bộ ngay trên trình duyệt của bạn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Space+Grotesk:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
