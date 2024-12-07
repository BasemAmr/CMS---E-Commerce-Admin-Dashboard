"use client";

import React, { useState } from 'react';
import { IKUpload } from "imagekitio-next";
import { Button } from "@/components/ui/button";
import { Trash } from 'lucide-react';
import { toast } from "sonner";
import Image from 'next/image';

interface ImageUploadProps {
  onSuccess: (url: string) => void;
  onRemove: () => void;
  existingImageUrl?: string;
  setFormLoading: (loading: boolean) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onSuccess, onRemove, existingImageUrl, setFormLoading }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(existingImageUrl || '');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = (res: any) => {
    setLoading(false);
    setImageUrl(res.url);
    onSuccess(res.url);
    setFormLoading(false);
    toast.success('Image uploaded successfully');
  };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (err: any) => {
    setLoading(false);
    setFormLoading(false);
    toast.error('Image upload failed');
    if (existingImageUrl) {
      setImageUrl(existingImageUrl);
    }
    console.error(err);
  };

  const handleUploadStart = () => {
    setLoading(true);
    setFormLoading(true);
    
  };

  const handleRemove = () => {
    setImageUrl('');
    onRemove();
  };

  const handleReset = () => {
    if (imageUrl === existingImageUrl) {
      toast.info('Image already reset');
      return;
    }

    setImageUrl(existingImageUrl || '');
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {imageUrl ? (
        <div className="relative">
          <div className='
              relative w-40 h-40 bg-gray-200 rounded border border-gray-200 flex items-center justify-center overflow-hidden
          '>

          <Image 
            src={imageUrl} 
            alt="Uploaded Image" 
            fill
            className="object-cover rounded border border-gray-200"
            sizes='(max-width: 640px) 100vw, 640px'
          />
            </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
      <Button 
        variant="outline" 
        onClick={() => document.getElementById('ik-upload-input')?.click()}
        disabled={loading}
        type='button'
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </Button>
      {
        existingImageUrl && (
          <Button 
            variant="outline"
            onClick={handleReset}
            disabled={
              loading
             }
            type='button'
          >
            Reset Previous Image
          </Button>
        )
      }
      <IKUpload
        fileName="billboard-upload.jpg"
        onError={handleError}
        onSuccess={handleSuccess}
        onUploadStart={handleUploadStart}
        style={{ display: 'none' }}
        id="ik-upload-input"
        accept='image/*'
        // max file size 10 MB in bytes
        validateFile={(file) => file.size <  10 * 1024 * 1024}

      />

    </div>
  );
};

export default ImageUpload;