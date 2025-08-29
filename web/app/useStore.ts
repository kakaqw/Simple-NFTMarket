import { useState, useEffect } from "react";
import { contractStore } from "./store/contractStore";

export const useStore = () => {
  const [nfts, setNfts] = useState(contractStore.getList());

  useEffect(() => {
    const unsubscribe = contractStore.subscribe(() => {
      setNfts(contractStore.getList());
    });

    return () => unsubscribe();
  }, []);

  return nfts;
};
