"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              NFT Market
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 font-medium"
            >
              探索
            </Link>

            <Link
              href="/mycollect"
              className="text-gray-700 hover:text-purple-600 font-medium"
            >
              我的收藏
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
