import { useAccount, useWalletClient } from "wagmi";
import { NftSwapAbi, NftAbi, contractAddress } from "./abi";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";

export const useContractInfo = () => {
  const { data: walletClient } = useWalletClient();
  const { isConnected } = useAccount();

  const publicClient = createPublicClient({
    chain: arbitrumSepolia,
    transport: http(),
  });

  // 检查钱包状态
  const checkWalletConnection = () => {
    if (!isConnected) {
      throw new Error("请先连接钱包");
    }
    if (!walletClient) {
      throw new Error("钱包客户端未初始化，请重新连接钱包");
    }
    return true;
  };

  //授权
  const approve = async (nftAddress: `0x${string}`, tokenId: number) => {
    try {
      // console.log("开始授权流程:");
      // console.log("- NFT地址:", nftAddress);
      // console.log("- TokenID:", tokenId);
      // console.log("- 授权给:", contractAddress);
      // console.log("- 当前账户:", walletClient.account?.address);

      checkWalletConnection();

      const tx = await walletClient.writeContract({
        address: nftAddress,
        abi: NftAbi,
        functionName: "approve",
        args: [contractAddress, tokenId],
        chain: walletClient.chain,
        account: walletClient.account,
      });

      return tx;
    } catch (error) {
      console.error("授权失败详细信息:");
      console.error("- 错误类型:", error.constructor.name);
      console.error("- 错误消息:", error.message);
      console.error("- 完整错误:", error);
      throw error;
    }
  };

  //上架
  const list = async (
    nftAddress: `0x${string}`,
    tokenId: number,
    price: number
  ) => {
    try {
      // 检查钱包连接状态
      checkWalletConnection();

      const tx = await walletClient.writeContract({
        address: contractAddress,
        abi: NftSwapAbi,
        functionName: "list",
        args: [nftAddress, tokenId, price],
        chain: walletClient.chain,
        account: walletClient.account,
      });

      // console.log("上架交易已发送:", tx);
      return tx;
    } catch (error) {
      console.error("上架失败:", error);
      throw error;
    }
  };

  //购买
  const buy = async (
    nftAddress: `0x${string}`,
    tokenId: number,
    price: number
  ) => {
    const tx = await walletClient.writeContract({
      address: contractAddress,
      abi: NftSwapAbi,
      functionName: "buy",
      args: [nftAddress, tokenId, price],
      value: price,
      chain: walletClient.chain,
      account: walletClient.account,
    });

    return tx;
  };

  //修改价格
  const updatePrice = async (
    nftAddress: `0x${string}`,
    tokenId: number,
    price: number
  ) => {
    const tx = await walletClient.writeContract({
      address: contractAddress,
      abi: NftSwapAbi,
      functionName: "update",
      args: [nftAddress, tokenId, price],
      chain: walletClient.chain,
      account: walletClient.account,
    });

    if (tx) {
      return true;
    }
    return false;
  };

  //取消上架的NFT
  const cancelList = async (nftAddress: `0x${string}`, tokenId: number) => {
    checkWalletConnection();

    const tx = await walletClient.writeContract({
      address: contractAddress,
      abi: NftSwapAbi,
      functionName: "cancel",
      args: [nftAddress, tokenId],
      chain: walletClient.chain,
      account: walletClient.account,
    });

    // console.log("cancelList", tx);
    return tx;
  };

  //获取上架的NFT
  const isList = async (nftAddress: `0x${string}`, tokenId: number) => {
    // checkWalletConnection();

    const tx = await publicClient.readContract({
      address: contractAddress,
      abi: NftSwapAbi,
      functionName: "isList",
      args: [nftAddress, tokenId],
    });

    // console.log("isList", Boolean(tx));
    return Boolean(tx);
  };

  //获取上架的NFT价格
  const getListPrice = async (nftAddress: `0x${string}`, tokenId: number) => {
    const tx = await publicClient.readContract({
      address: contractAddress,
      abi: NftSwapAbi,
      functionName: "lists",
      args: [nftAddress, tokenId],
    });

    return tx;
  };

  return {
    buy,
    list,
    approve,
    isList,
    getListPrice,
    cancelList,
    updatePrice,
    isWalletConnected: isConnected && !!walletClient,
  };
};
