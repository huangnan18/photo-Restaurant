import type { Metadata } from "next";
import SiteSidebar from "@/components/SiteSidebar";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "拾光 · 摄影集",
    template: "%s · 拾光",
  },
  description: "a photography journal — 用镜头记录行走的光",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Long+Cang&family=Noto+Serif+SC:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="film-frame" aria-hidden="true">
          <span className="stock">Kodak Portra 400 · 拾光</span>
        </div>
        <div className="shell">
          <SiteSidebar />
          <div className="content">
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
