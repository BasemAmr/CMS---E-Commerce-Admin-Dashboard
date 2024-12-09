"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import FileUpload from "../FileUpload";

interface ImageUploadProps {
  onSuccess: (urls: string[]) => void; // Pass the updated array of image URLs
  onRemove: (urls: string[]) => void; // Pass the updated array when an image is removed
  existingImages?: string[]; // Array of existing image URLs
  setFormLoading: (loading: boolean) => void;
  multiple?: boolean; // Flag to allow single or multiple upload
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onSuccess,
  onRemove,
  existingImages = [],
  setFormLoading,
  multiple = true, // Default to multiple uploads
}) => {
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(existingImages);

  // Handle successful upload

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = (res: any) => {
    setLoading(false);
    setFormLoading(false);

    console.log(res);
    const newUrl = res;

    console.log(multiple);

    console.log(imageUrls);

    const updatedUrls = multiple ? [...imageUrls, ...newUrl] : [newUrl];

    setImageUrls(updatedUrls);

    onSuccess(updatedUrls);

    console.log(updatedUrls);
    toast.success("Image uploaded successfully");
  };

  // Handle upload error

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (err: any) => {
    setLoading(false);
    setFormLoading(false);
    toast.error("Image upload failed");
    console.error(err);
  };

  const handleUploadStart = () => {
    setLoading(true);
    setFormLoading(true);
  };

  // Remove an image from the list
  const handleRemove = (url: string) => {
    const updatedUrls = imageUrls.filter((image) => image !== url);
    setImageUrls(updatedUrls);
    onRemove(updatedUrls);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Display uploaded images */}
      <div className="grid grid-cols-3 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative group">
            <div className="relative w-40 h-40 bg-gray-200 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
              <Image
                src={url}
                alt={`Uploaded Image ${index + 1}`}
                fill
                className="object-cover rounded"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleRemove(url)}
              type="button"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      <Button
        variant="outline"
        onClick={() => document.getElementById("ik-upload-input")?.click()}
        disabled={loading}
        type="button"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </Button>

      {/* Hidden FileUpload input */}
      <FileUpload
        onError={handleError}
        onSuccess={handleSuccess}
        onUploadStart={handleUploadStart}
        style={{ display: "none" }}
        id="ik-upload-input"
        accept="image/*"
        validateFile={(file) => file.size < 10 * 1024 * 1024} // 10 MB max size
        multiple={multiple}
      />

      {/* Message for empty state */}
      {!imageUrls.length && (
        <p className="text-sm text-gray-500">
          No images uploaded yet. Images must be less than 10MB.
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
