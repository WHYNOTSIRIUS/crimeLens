"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onError,
  className,
  disabled
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      setIsUploading(true);
      
      const uploadedUrls = await Promise.all(
        acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const data = await response.json();
          return data.filename;
        })
      );

      onChange([...value, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
      onError?.(error instanceof Error ? error.message : "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  }, [value, onChange, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"]
    },
    disabled: disabled || isUploading,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/10" : "border-gray-300",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-8 w-8 text-gray-400" />
          {isUploading ? (
            <p className="text-sm text-gray-600">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-gray-600">Drop the files here</p>
          ) : (
            <p className="text-sm text-gray-600">
              Drag &apos;n&apos; drop images here, or click to select
            </p>
          )}
          <p className="text-xs text-gray-400">
            Supports: PNG, JPG, JPEG, GIF (max 5MB)
          </p>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {value.map((url, index) => (
            <div key={url} className="relative aspect-video rounded-lg overflow-hidden group">
              <Image
                src={url}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
