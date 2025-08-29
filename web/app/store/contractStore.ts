import { NFTItem } from "../interface";
type Listener = () => void;
class ContractStore {
  private listNFT: NFTItem[] = []; //上架的NFT列表

  private listeners: Listener[] = []; //监听器数组

  //添加监听器
  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  //通知监听器
  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getList() {
    return this.listNFT;
  }

  pushList(data: NFTItem) {
    // console.log("pushList", data);

    //预防重复添加
    const exists = this.listNFT.some(
      (item) => item.NFTAddress == data.NFTAddress && item.id == data.id
    );

    if (!exists) {
      this.listNFT.push(data);
      this.notify();
    }
  }

  removeList(data: NFTItem) {
    // console.log("removeList", data);
    const index = this.listNFT.findIndex(
      (item) => item.NFTAddress === data.NFTAddress && item.id === data.id
    );

    if (index > -1) {
      this.listNFT.splice(index, 1); //第一个参数是开始删除的索引，第二个参数是删除的数量
      this.notify();
    }
    // console.log("listNFT", this.listNFT);
  }

  updateList(NFTAddress: `0x${string}`, id: number, price: number) {
    const index = this.listNFT.findIndex((item) => {
      return item.NFTAddress == NFTAddress && item.id == id;
    });

    if (index > -1) {
      this.listNFT[index].price = price.toString();
      this.notify();
    }
  }
}

export const contractStore = new ContractStore();
