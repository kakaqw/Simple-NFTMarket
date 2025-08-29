"use client";

import { useState, useEffect } from "react";
import { Header } from "../../components/header";
import { NFTRevealGrid } from "../../components/nft-revealGrid";
import { NFTItem } from "@/app/interface";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { setWalletNFT, walletNFT } from "../store/accountStore";
import { contractStore } from "../store/contractStore";
import { useContractInfo } from "../contractFunc";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { alchemy } from "../store/accountStore";

// 模拟收藏的NFT数据

export default function CollectionPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { address, isConnected } = useAccount();
  const { isList, getListPrice } = useContractInfo();

  // 计算收藏总价值
  useEffect(() => {
    if (isConnected && address) {
      loadNFTs();
    } else {
      // 断开钱包时清空数据
      setWalletNFT([]);
    }
  }, [isConnected, address]);

  const loadNFTs = async () => {
    setIsLoading(true);
    try {
      let response = await alchemy.nft.getNftsForOwner(address);
      console.log("response", response);

      const nfts: NFTItem[] = await Promise.all(
        //遍历NFT获取已上架的NFT
        response.ownedNfts.map(async (nft) => {
          const checkIsList: boolean = await isList(
            nft.contract.address as `0x${string}`,
            Number(nft.tokenId)
          );
          //获取价格
          const price = await getListPrice(
            nft.contract.address as `0x${string}`,
            Number(nft.tokenId)
          );

          //设置nft 基础信息
          const nftItem: NFTItem = {
            id: Number(nft.tokenId),
            name: nft.contract.name,
            image: nft.raw.tokenUri,
            price: formatEther(price[1]),
            creator: nft.contract.symbol,
            NFTAddress: nft.contract.address,
            isList: checkIsList,
          };
          console.log("NFT", nftItem);
          if (checkIsList) {
            //上架的NFT
            contractStore.pushList(nftItem);
          }

          return nftItem;
        })
      );

      setWalletNFT(nfts);
      // console.log(nfts);
    } catch (error) {
      console.error("加载NFT失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回市场
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                我的收藏
              </h1>
              <p className="text-gray-600">管理您收藏的NFT作品</p>
            </div>
          </div>
        </div>

        {/* NFT网格 */}
        {walletNFT.length > 0 ? (
          <NFTRevealGrid nfts={walletNFT} />
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              暂无收藏
            </h3>
            <p className="text-gray-600 mb-6">
              您还没有收藏任何NFT，去市场看看吧！
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                浏览市场
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
