"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <h1 className="site-title">
        <Link href="/" className="no-underline text-[var(--color-text)]">
          拾光
        </Link>
      </h1>
      <p className="site-subtitle">a photography journal</p>
      <nav className="site-nav">
        <NavLink href="/" active={pathname === "/"}>
          照片
        </NavLink>
        <NavLink href="/albums" active={pathname === "/albums"}>
          相册
        </NavLink>
        <NavLink href="/about" active={pathname === "/about"}>
          关于
        </NavLink>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={active ? "active" : ""}>
      {children}
    </Link>
  );
}
