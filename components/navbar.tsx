"use client";

import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Store } from '@prisma/client'
import MainNav from './mainnav'
import { useStoreModal } from '@/hooks/use-store-modal'
import { useParams, useRouter } from 'next/navigation'

interface NavbarProps {
  stores: Store[]
}

const Navbar: React.FC<NavbarProps> = ({
  stores
}) => {
  const storeModal = useStoreModal();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);

  const formattedItems = stores.map((store) => ({
    label: store.name,
    value: store.id
  }));

  const currentStore = formattedItems.find((item) => item.value === params.storeId);

  const onStoreSelect = (store: { value: string, label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a store"
              className="w-[200px] justify-between"
            >
              <span className="truncate">
                {currentStore?.label || "Select a store"}
              </span>
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search store..." />
              <CommandList>
                <CommandEmpty>No store found.</CommandEmpty>
                <CommandGroup heading="Stores">
                  {formattedItems.map((store) => (
                    <CommandItem
                      key={store.value}
                      onSelect={() => onStoreSelect(store)}
                      className="text-sm"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentStore?.value === store.value 
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {store.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      storeModal.setIsOpen(storeModal.isOpen)
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Store
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}

export default Navbar