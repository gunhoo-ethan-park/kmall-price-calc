"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/", label: "홈" },
  { href: "/logistics", label: "물류비" },
  { href: "/sales-price", label: "판매가" },
  { href: "/margin", label: "마진" },
  { href: "/profit", label: "영업이익" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <span className="text-blue-700 font-bold text-lg">KMall</span>
        <div className="flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm text-gray-500 hover:text-red-500 transition"
      >
        로그아웃
      </button>
    </nav>
  );
}
