"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

export default function SiteSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1 className="sidebar-title">
          <Link href="/">拾光</Link>
        </h1>
        <p className="sidebar-subtitle">a photography journal</p>
      </div>

      <nav className="sidebar-nav">
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

      <div className="sidebar-meta">
        <div className="count">用镜头记录行走的光</div>
        <div>© {new Date().getFullYear()} 拾光</div>
      </div>
    </aside>
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
