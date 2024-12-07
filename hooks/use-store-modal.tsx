import {create} from 'zustand';

interface StoreModal {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const useStoreModal = create<StoreModal>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen) =>  set({
        isOpen: !isOpen
    }),
   
}));