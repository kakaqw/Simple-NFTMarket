import { useState, useEffect } from "react";
import { contractStore } from "./contractStore";

export const useStore = () => {
  const [nfts, setNfts] = useState(contractStore.getList());

  useEffect(() => {
    const unsubscribe = contractStore.subscribe(() => {
      setNfts(contractStore.getList());
    });
    // console.log("nfts", nfts);
    return () => unsubscribe();
  }, []);

  return nfts;
};
