import React, { useState, DragEvent, ChangeEvent, useContext } from "react";
import { Upload } from "lucide-react";
import { StateContext } from "@/modules/builder/resume/ResumeLayout";
import Image from "next/image";

interface ImageUploaderProps {
  onChangeHandler: (url: string, type: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChangeHandler }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file && file.type.match("image.*")) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      onChangeHandler(imageUrl, "image");
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const resumeData = useContext(StateContext);

  const basics = resumeData?.basics || {};

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Image
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ease-in-out flex flex-col items-center justify-center
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
          ${preview ? "h-auto" : "h-48"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*"
          onChange={handleInputChange}
          aria-label="Upload image"
        />

        {preview ? (
          <div className="w-full">
            <Image
              src={basics.image}
              width={1000}
              height={1000}
              alt="Preview"
              className="mx-auto max-h-64 rounded-md object-contain mb-4"
            />
            <p className="text-sm text-center text-gray-500">
              Click or drag to replace image
            </p>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
