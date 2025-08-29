"use client";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NFTCardProps } from "../app/interface";
import { useContractInfo } from "../app/contractFunc";
import { contractStore } from "../app/store/contractStore";
import { parseEther } from "viem";
import axios from "axios";

export function NFTCard({ nft }: NFTCardProps) {
  const { buy } = useContractInfo();

  const buyNFT = async () => {
    try {
      const tx = await buy(
        nft.NFTAddress as `0x${string}`,
        nft.id,
        Number(parseEther(nft.price))
      );
      if (tx) {
        contractStore.removeList(nft);
        await axios.post("http://localhost:3001/cancelList", { data: nft });
      }
    } catch (errer) {
      console.log(errer);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={nft.image}
          alt={nft.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
        ></Button>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{nft.name}</h3>

        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={nft.creator || "/placeholder.svg?height=24&width=24"}
            />
          </Avatar>
          <span className="text-sm text-gray-600">{nft.creator}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">价格</div>
            <div className="font-bold text-lg">{nft.price} ETH</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          onClick={buyNFT}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          立即购买
        </Button>
      </CardFooter>
    </Card>
  );
}
