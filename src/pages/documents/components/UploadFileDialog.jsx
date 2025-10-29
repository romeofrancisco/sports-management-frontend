import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUploadFile } from "@/hooks/useDocuments";
import Modal from "@/components/common/Modal";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledTextarea from "@/components/common/ControlledTextarea";
import { Button } from "@/components/ui/button";
import { Upload, FileIcon, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UploadFileDialog = ({ open, onOpenChange, currentFolder, rootData }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError: setFormError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      file: null,
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
      setSelectedFile(null);
      setError("");
    }
  }, [open, reset]);

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file extension
      const allowedExtensions = [
        // Images
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp',
        // Documents
        'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'
      ];
      
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split('.').pop();
      
      if (!allowedExtensions.includes(fileExtension)) {
        setError(`Invalid file type. Only images and documents are allowed (${allowedExtensions.join(', ')})`);
        return;
      }
      
      setError("");
      setSelectedFile(file);
      setValue("file", file);
      
      // Auto-fill title if empty
      if (!control._formValues.title) {
        setValue("title", file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const onSubmit = async (data) => {
    setError("");

    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    // Use personal_folder_id from rootData if at root (for coaches/players)
    const targetFolderId =
      currentFolder?.id || rootData?.personal_folder_id || null;

    uploadFile(
      {
        file: selectedFile,
        title: data.title.trim(),
        description: data.description?.trim() || "",
        folder: targetFolderId,
      },
      {
        onSuccess: () => {
          reset();
          setSelectedFile(null);
          onOpenChange(false);
        },
        onError: (e) => {
          console.log("Error response:", e.response);
          const errorData = e.response?.data;
          
          if (errorData) {
            console.log("Error data:", errorData);
            
            // Check if error is a string (non-field error)
            if (typeof errorData === 'string') {
              setError(errorData);
              return;
            }
            
            // Check for non_field_errors
            if (errorData.non_field_errors) {
              const errorMessage = Array.isArray(errorData.non_field_errors)
                ? errorData.non_field_errors[0]
                : errorData.non_field_errors;
              setError(errorMessage);
              return;
            }
            
            // Handle field-specific errors
            Object.keys(errorData).forEach((fieldName) => {
              // Skip if the key looks like it's part of a split string (numeric keys)
              if (!isNaN(fieldName)) {
                return;
              }
              
              // Handle both string and array error formats
              let errorMessage = errorData[fieldName];
              if (Array.isArray(errorMessage)) {
                errorMessage = errorMessage[0]; // Take the first error message
              }
              console.log(`Setting error for ${fieldName}:`, errorMessage);
              
              // Set error for form fields, or show general error
              if (fieldName === 'file' || fieldName === 'title' || fieldName === 'description' || fieldName === 'folder') {
                setFormError(fieldName, {
                  type: "server",
                  message: errorMessage,
                });
              } else {
                setError(errorMessage);
              }
            });
          } else {
            setError("Failed to upload file. Please try again.");
          }
        },
      }
    );
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValue("file", null);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Upload File"
      description="Upload a file to the current folder"
      icon={Upload}
      size="md"
      scrollable={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* File Upload Area */}
        <div className="space-y-2">
          <ControlledInput
            name="file"
            control={control}
            label="File"
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.bmp,.svg,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            onChange={(e) => handleFileChange(e.target.files)}
            errors={errors}
            rules={{ required: "File is required" }}
            className="hidden"
          />
          
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {selectedFile ? (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileIcon className="w-10 h-10 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-600 font-medium">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFile();
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400">
                    Any file type supported
                  </p>
                </div>
              )}
            </label>
          </div>
          {errors.file && (
            <p className="text-xs text-left text-destructive">
              {errors.file.message}
            </p>
          )}
        </div>

        {/* Title Input */}
        <ControlledInput
          name="title"
          control={control}
          label="Title"
          placeholder="Enter file title"
          errors={errors}
          rules={{ required: "Title is required" }}
          disabled={isUploading}
        />

        {/* Description Textarea */}
        <ControlledTextarea
          name="description"
          control={control}
          label="Description"
          placeholder="Enter file description (optional)"
          rows={3}
          errors={errors}
          disabled={isUploading}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isUploading || !selectedFile}>
            {isUploading ? (
              <>
                <Upload className="animate-pulse" />
                Uploading...
              </>
            ) : (
              <>
                <Upload />
                Upload
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadFileDialog;
