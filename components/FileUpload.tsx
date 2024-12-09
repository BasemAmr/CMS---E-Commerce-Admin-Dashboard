import React, { useRef } from "react";
import ImageKit from "imagekit-javascript";
import { publicKey, urlEndpoint } from "@/lib/i-kit-auth";

const imageKit = new ImageKit({
  publicKey: publicKey,
  urlEndpoint: urlEndpoint || "",
});

interface FileUploadProps {
  onError: (message: string) => void;
  onSuccess: (res: string[]) => void;
  onUploadStart: () => void;
  style?: React.CSSProperties;
  id?: string;
  accept?: string;
  validateFile: (file: File) => boolean;
  multiple?: boolean;
}
const FileUpload: React.FC<FileUploadProps> = ({onError,onSuccess,onUploadStart,style,id,accept,validateFile,multiple}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urls: string[] = [];
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate all files before uploading
    for (const file of files) {
      if (!validateFile(file)) {
        onError(`File ${file.name} is too large. Maximum size is 10 MB.`);
        return;
      }
    }

    // Start upload process
    onUploadStart();

    try {
      // Fetch security credentials

      // Upload each file
      for (const file of files) {
        const credentials = await fetchSecurityCredentials();
        if (!credentials) {
          onError("Failed to fetch security credentials from the server.");
          return;
        }
        try {
          const response = await uploadFile(file, credentials);
          urls.push(response.url);
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          onError(`Failed to upload ${file.name}`);
        }
      }

      if (urls.length === 0) {
        onError("No files were uploaded.");
        return;
      } 
    
      onSuccess(urls);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      onError(`An unexpected error occurred:`);
    }
  };

  // Helper function to fetch security credentials
  const fetchSecurityCredentials = async () => {
    try {
      const response = await fetch("/api/auth");
      if (!response.ok) {
        console.error("Failed to fetch credentials:", response.statusText);
        return null;
      }
      const data = await response.json();
      if (!data.signature || !data.token || !data.expire) {
        console.error("Invalid credentials received:", data);
        return null;
      }
      return data;
    } catch (error) {
      console.error("Error fetching security credentials:", error);
      return null;
    }
  };

  // Helper function to upload a single file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadFile = async (file: File, credentials: any) => {
    const uploadOptions = {
      file: file,
      fileName: file.name,
      signature: credentials.signature,
      token: credentials.token,
      expire: credentials.expire,
      tags: [`tag-${Math.random()}`],
    };
    console.log("Uploading file with options:", uploadOptions);
    const response = await imageKit.upload(uploadOptions);
    return response;
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        style={style}
        id={id}
        accept={accept}
        multiple={multiple}
      />
    </div>
  );
};

export default FileUpload;
