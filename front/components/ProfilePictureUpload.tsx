"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, User } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface ProfilePictureUploadProps {
  currentPicture?: string;
  onPictureChange: (file: File | null) => void;
  userId?: string;
}

export default function ProfilePictureUpload({ 
  currentPicture, 
  onPictureChange,
  userId 
}: ProfilePictureUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showToast("Please select an image file", "error");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("Image size must be less than 5MB", "error");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onPictureChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onPictureChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-200 shadow-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 rounded-full bg-slate-200 flex items-center justify-center border-4 border-slate-300 shadow-lg">
            <User className="w-16 h-16 text-slate-400" />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="border-slate-200"
        >
          <Camera className="w-4 h-4 mr-2" />
          {preview ? "Change Picture" : "Upload Picture"}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
            className="border-red-200 text-red-700 hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        )}
      </div>

      <p className="text-xs text-slate-500 text-center">
        Recommended: Square image, max 5MB
      </p>
    </div>
  );
}

