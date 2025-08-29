import { NFTItem } from "@/app/interface";
import { Alchemy, Network } from "alchemy-sdk";

export let walletNFT: NFTItem[] = []; //钱包的NFT列表

export let account: string; //钱包地址

const config = {
  apiKey: "5V6l-roS3N3mAMsPlIlkO",
  network: Network.ARB_SEPOLIA,
};

export const alchemy = new Alchemy(config);

export const setWalletNFT = (data: NFTItem[]) => {
  walletNFT = data;
};

export const changeWalletNFT = (data: NFTItem) => {
  const index = walletNFT.findIndex(
    (item) => item.id == data.id && item.NFTAddress == data.NFTAddress
  );

  if (index > -1) {
    walletNFT[index] = data;
    // console.log(walletNFT[index]);
  }
  // console.log("walletNFT", walletNFT);
};

export const setAccount = (data: string) => {
  account = data;
};
