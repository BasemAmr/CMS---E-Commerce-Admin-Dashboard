"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Server } from "lucide-react";
import { toast } from "sonner";
import { useOrigin } from "@/hooks/use-origin";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
    public: "secondary",
    admin: "destructive",
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title,
    description,
    variant = "public",
}) => {

    const onCopy = () => {
        navigator.clipboard.writeText(description);
        toast.success("API Route copied to clipboard.");
    };

    return (
        <Alert>
            <Server className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
                {title}
                <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
            </AlertTitle>
                {/* add line break and continue next line if overflow */}
            <AlertDescription className="mt-4 flex items-center justify-between">
                <div className="break-all  w-full">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {description}
                    </code>
                </div>
                <Button variant="outline" size="sm" onClick={onCopy}>
                    <Copy className="h-4 w-4" />
                </Button>
            </AlertDescription>
        </Alert>
    );
};

interface ApiListProps {
    entityName: string;
    entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({ entityName, entityIdName }) => {
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${entityName}`;

    const apis = [
        {
            title: "GET",
            description: `${baseUrl}`,
            variant: "public",
        },
        {
            title: "GET",
            description: `${baseUrl}/{${entityIdName}}`,
            variant: "public",
        },
        {
            title: "POST",
            description: `${baseUrl}`,
            variant: "admin",
        },
        {
            title: "PATCH",
            description: `${baseUrl}/{${entityIdName}}`,
            variant: "admin",
        },
        {
            title: "DELETE",
            description: `${baseUrl}/{${entityIdName}}`,
            variant: "admin",
        },
    ];

    return (
        <div className="space-y-4 ">
            {apis.map((api) => (
                <ApiAlert
                    key={`${api.title}-${api.description}`}
                    title={api.title}
                    description={api.description}
                    variant={api.variant as "public" | "admin"}
                />
            ))}
        </div>
    );
};
