"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    title: string;
    description: string;
}

export default function AlertModal({
    isOpen,
    onClose,
    onConfirm,
    loading,
    title,
    description,
}: AlertModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex items-center justify-end space-x-2 w-full">
                        <Button
                            disabled={loading}
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={loading}
                            variant="destructive"
                            onClick={onConfirm}
                        >
                            Continue
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}