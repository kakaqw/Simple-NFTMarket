//NFT列表类型
export interface NFTItem {
  id: number;
  name: string;
  image: string;
  price: string;
  creator: string;
  NFTAddress: string;
  isList: boolean;
}

//NFT卡片类型
export interface NFTCardProps {
  nft: NFTItem;
  onLike?: (id: number) => void;
  onPurchase?: (id: number) => void;
  isLiked?: boolean;
}

//NFT网格类型
export interface NFTGridProps {
  nfts: NFTItem[];
  onLike?: (id: number) => void;
  onPurchase?: (id: number) => void;
}
