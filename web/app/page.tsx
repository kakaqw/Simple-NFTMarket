"use client";
import { useState, useEffect } from "react";
import { MarketplaceLayout } from "@/components/marketplace-layout";
import { useAccount } from "wagmi";
import { setWalletNFT } from "@/app/store/accountStore";
import { useStore } from "./useStore";
import axios from "axios";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [NFTs, setNFTs] = useState([]);

  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      try {
        setIsLoading(true);
        getNFT();
      } catch (error) {
        console.error("加载NFT失败:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // 断开钱包时清空数据
      setWalletNFT([]);
    }
  }, [isConnected, address]); // 当连接状态或地址变化时触发

  const getNFT = async () => {
    const res = await axios.get("http://localhost:3001/getList");
    setNFTs(res.data);
    console.log("NFTs", NFTs);
  };

  return (
    <div>
      {/* <button>Get NFT Info</button> */}
      <MarketplaceLayout nfts={NFTs} />
    </div>
  );
}
