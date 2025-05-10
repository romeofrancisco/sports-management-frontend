import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ImageUpload = ({
  onImageChange,
  previewUrl,
  existingImageUrl,
  aspectRatio = "1:1",
  className = "",
  help_text = "Upload an image",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  
  // Determine what image to display (preview, existing, or none)
  const displayUrl = previewUrl || existingImageUrl || null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file (jpg, png, etc.)');
      return;
    }
    
    // Pass the file to parent component
    onImageChange(file);
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleRemoveImage = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onImageChange(null);
  };

  const aspectRatioClasses = {
    "1:1": "aspect-square",
    "16:9": "aspect-video",
    "4:3": "aspect-4/3",
    "3:2": "aspect-3/2",
    "2:1": "aspect-2/1",
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-md",
          dragActive ? "border-primary bg-muted/70" : "border-border bg-muted/20",
          aspectRatioClasses[aspectRatio] || "aspect-square",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        {displayUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={displayUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Drag & drop image here</p>
            <p className="text-xs text-muted-foreground mb-4">or</p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleButtonClick}
            >
              Select File
            </Button>
          </div>
        )}
      </div>
      
      {help_text && (
        <p className="text-xs text-muted-foreground">{help_text}</p>
      )}
    </div>
  );
};

export default ImageUpload;