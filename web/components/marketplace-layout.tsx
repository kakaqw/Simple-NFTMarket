"use client";

import { Header } from "./header";
import { NFTGrid } from "./nft-grid";
import type { NFTItem } from "../app/interface";

interface MarketplaceLayoutProps {
  nfts?: NFTItem[];
  // onLike?: (id: number) => void;
  onPurchase?: (id: number) => void;
}

export function MarketplaceLayout({
  nfts = [],
  // onLike,
  onPurchase,
}: MarketplaceLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NFTGrid nfts={nfts} /*onLike={onLike}*/ onPurchase={onPurchase} />
      </div>
    </div>
  );
}
