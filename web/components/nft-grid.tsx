"use client";

import { NFTCard } from "./nft-card";
import { NFTGridProps } from "../app/interface";

export function NFTGrid({ nfts }: NFTGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">暂无NFT展示</div>
        <div className="text-gray-400 text-sm mt-2">请添加NFT数据进行展示</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {nfts.map((nft) => (
        <NFTCard key={`${nft.id}-${nft.NFTAddress}`} nft={nft} />
      ))}
    </div>
  );
}
