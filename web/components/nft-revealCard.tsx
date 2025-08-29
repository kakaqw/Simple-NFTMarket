"use client";
import { useState } from "react";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { NFTCardProps } from "../app/interface";
import { contractStore } from "../app/store/contractStore";
import { changeWalletNFT } from "../app/store/accountStore";
import { useContractInfo } from "../app/contractFunc";
import { parseEther } from "viem";
import axios from "axios";

export function NFTRevealCard({ nft }: NFTCardProps) {
  const { list, approve, isWalletConnected, cancelList, updatePrice } =
    useContractInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  //确认是否修改价格
  const [updateOrCancel, setUpdateOrCancel] = useState(false);

  //上架价格
  const [listPrice, setListPrice] = useState("");

  //修改价格
  const [changePrice, setChangePrice] = useState("");

  //确认是否上架
  const [checkIsList, setChecksList] = useState(nft.isList);

  //上架
  const handleList = async () => {
    // console.log("nft", nft);

    setIsLoading(true);
    setError("");
    try {
      if (!isWalletConnected) {
        throw new Error("请先连接钱包");
      }

      //检测是否上架
      let isOrder: boolean = false;
      const order = contractStore.getList();
      if (order) {
        order.find((item) => {
          if (item.NFTAddress == nft.NFTAddress && item.id == nft.id) {
            isOrder = true;
            // console.log("isOrder", isOrder);
          }
        });
      }

      if (isOrder) {
        throw new Error("该NFT已上架");
      } else {
        //检测价格是否大于0
        if (Number(listPrice) <= 0) {
          throw new Error("价格不能小于0");
        }

        //授权
        const tx1 = await approve(nft.NFTAddress as `0x${string}`, nft.id);
        // console.log("授权", tx1);

        //上架
        const tx2 = await list(
          nft.NFTAddress as `0x${string}`,
          nft.id,
          Number(parseEther(listPrice))
        );
        // console.log("上架", tx2);

        //更新NFT上架状态
        nft.isList = true;
        nft.price = listPrice;
        setChecksList(true);

        //更新NFT上架列表
        contractStore.pushList(nft);
        await axios.post("http://localhost:3001/list", {
          data: nft,
        });
        // console.log(nft);
      }
    } catch (error) {
      console.error("上架失败:", error);
    }
  };

  //下架
  const handleCancelList = async () => {
    // console.log(nft);
    const tx = await cancelList(nft.NFTAddress as `0x${string}`, nft.id);

    // console.log("合约已取消上架", tx);

    contractStore.removeList(nft);
    await axios.post("http://localhost:3001/cancelList", {
      data: nft,
    });
    nft.isList = false;
    changeWalletNFT(nft);
    setChecksList(nft.isList);
    // console.log("nft", nft);
  };

  //修改价格
  const hanleUpdatePrice = async () => {
    try {
      //向合约发起交易修改价格
      const tx = await updatePrice(
        nft.NFTAddress as `0x${string}`,
        nft.id,
        Number(parseEther(changePrice))
      );
      // console.log("tx", tx);
      if (tx) {
        //更改contractStore中的价格
        contractStore.updateList(
          nft.NFTAddress as `0x${string}`,
          nft.id,
          Number(parseEther(changePrice))
        );
      }

      //更新NFT价格
      nft.price = changePrice;
      //更新钱包NFT
      changeWalletNFT(nft);
      console.log("nft", nft.price);
      await axios.post("http://localhost:3001/updatePrice", { data: nft });
      //关闭修改价格弹窗
      setUpdateOrCancel(false);

      return tx;
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img
          src={
            "https://lime-petite-alligator-828.mypinata.cloud/ipfs/bafkreic3tomlgdluj44hknfiwsdwd2w7dfz5sx33dxz2uhegzr2scmz2lq"
          }
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
        <div className="flex justify-between">
          <div className="font-semibold text-lg mb-2 truncate">{nft.name}</div>
          <div className="font-bold text-lg mb-2 truncate">
            {checkIsList ? nft.price + " ETH" : "未上架"}
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={nft.creator || "/placeholder.svg?height=24&width=24"}
            />
          </Avatar>
          <span className="text-sm text-gray-600">{nft.creator}</span>
        </div>
        <CardFooter>
          {checkIsList ? (
            <>
              {updateOrCancel ? (
                <div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="输入价格"
                      value={changePrice}
                      onChange={(e) => setChangePrice(e.target.value)}
                      className="flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-sm text-gray-500 font-medium">
                      ETH
                    </span>
                  </div>
                  {changePrice ? (
                    <Button
                      className="flex-1 bg-gradient-to-r w-full mt-2 from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={async () => {
                        await hanleUpdatePrice();
                      }}
                    >
                      <Store className="h-4 w-4 mr-2" />
                      修改价格
                    </Button>
                  ) : (
                    <Button
                      className="flex-1 bg-gradient-to-r w-full mt-2 from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={() => {
                        setUpdateOrCancel(false);
                      }}
                    >
                      <Store className="h-4 w-4 mr-2" />
                      返回
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <Button
                    className="flex-1 bg-gradient-to-r mr-2 from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={() => setUpdateOrCancel(true)}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    修改价格
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={handleCancelList}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    取消上架
                  </Button>
                </>
              )}
            </>
          ) : (
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="输入价格"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  className="flex-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-gray-500 font-medium">ETH</span>
              </div>

              <Button
                className="flex-1 bg-gradient-to-r w-full mt-2 from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                onClick={handleList}
              >
                <Store className="h-4 w-4 mr-2" />
                上架
              </Button>
            </div>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
