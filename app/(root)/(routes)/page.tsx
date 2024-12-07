"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import  { useEffect } from "react";

const Page = () => {
  const {isOpen, setIsOpen} = useStoreModal();
    useEffect(() => {
        if (!isOpen) {
            setIsOpen(isOpen);
        }
    }, [isOpen, setIsOpen]);
    

  return null;
};

export default Page;
