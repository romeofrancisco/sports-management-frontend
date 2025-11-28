import React, { useState, useEffect } from "react";
import { useUploadFile } from "@/hooks/useDocuments";
import api from "@/api";
import { getStoredTokens, hasValidTokens, useGoogleAuth } from "@/features/editors/hooks/useGoogleEditor";
import { queryClient } from "@/context/QueryProvider";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileIcon,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const MultipleUploadDialog = ({
  open,
  onOpenChange,
  currentFolder,
  rootData,
  draggedFiles = [],
}) => {
  const [files, setFiles] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [failedFiles, setFailedFiles] = useState([]);
  const { mutate: uploadFile, isPending: isUploadingLegacy } = useUploadFile();
  const { isAuthenticated, startAuth } = useGoogleAuth();
  const [isUploading, setIsUploading] = useState(false);

  const allowedExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "svg",
    "webp",
    "pdf",
    "doc",
    "docx",
    "xls",
    "xlsx",
    "ppt",
    "pptx",
    "txt",
    "csv",
  ];

  // Handle dragged files
  useEffect(() => {
    if (draggedFiles.length > 0 && open) {
      processFiles(draggedFiles);
    }
  }, [draggedFiles.length, open]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setFiles([]);
      setUploadingIndex(null);
      setUploadedCount(0);
      setFailedFiles([]);
    }
  }, [open]);

  const processFiles = (fileList) => {
    const validFiles = [];
    const invalidFiles = [];

    Array.from(fileList).forEach((file) => {
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split(".").pop();

      if (allowedExtensions.includes(fileExtension)) {
        validFiles.push({
          file,
          title: file.name.replace(/\.[^/.]+$/, ""),
          status: "pending", // pending, uploading, success, error
          error: null,
        });
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} file(s) skipped (invalid type)`);
    }

    setFiles(validFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  };

  const updateFileTitle = (index, newTitle) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, title: newTitle } : f))
    );
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAllFiles = async () => {
    const targetFolderId =
      currentFolder?.id || rootData?.personal_folder_id || null;
    const tokens = getStoredTokens();
    const hasTokens = !!tokens;
    if (!hasTokens) {
      toast.error("Connect to Google Drive first", {
        description: "Please sign in with Google before uploading documents.",
      });
      startAuth();
      return;
    }
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "success") continue; // Skip already uploaded

      setUploadingIndex(i);

      // Update status to uploading
      setFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f))
      );

      try {
        // Build FormData for Google Drive direct create
        const formData = new FormData();
        formData.append("file", files[i].file);
        formData.append("title", files[i].title.trim());
        if (targetFolderId) formData.append("folder", targetFolderId);
        formData.append("description", "");
        formData.append("tokens", JSON.stringify(tokens));

        const resp = await api.post("/documents/google/create/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (resp.data?.document) {
          setFiles((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, status: "success" } : f
            )
          );
          setUploadedCount((prev) => prev + 1);
          // Invalidate queries so the UI fetches updated folder contents
          try {
            queryClient.invalidateQueries({ queryKey: ["folder-contents", targetFolderId] });
            queryClient.invalidateQueries({ queryKey: ["root-folders"] });
          } catch (e) {
            console.warn("Failed to invalidate queries after upload:", e);
          }
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        let errorMessage = "Failed to upload file";
        if (error?.response?.data) {
          const errorData = error.response.data;
          if (errorData.folder && Array.isArray(errorData.folder)) {
            errorMessage = errorData.folder[0];
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: "error", error: errorMessage }
              : f
          )
        );
        setFailedFiles((prev) => [...prev, files[i].title]);
      }
    }
    setUploadingIndex(null);
    setIsUploading(false);
    // Final invalidation to ensure UI is up-to-date after batch upload
    try {
      queryClient.invalidateQueries({ queryKey: ["folder-contents", targetFolderId] });
      queryClient.invalidateQueries({ queryKey: ["root-folders"] });
    } catch (e) {
      console.warn("Failed to invalidate queries after batch upload:", e);
    }
  };

  const canUpload = files.length > 0 && uploadingIndex === null;
  const allUploaded =
    files.length > 0 && files.every((f) => f.status === "success");
  const progress = files.length > 0 ? (uploadedCount / files.length) * 100 : 0;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={UploadCloud}
      title="Upload Multiple Files"
      description={`Upload files to ${
        currentFolder ? currentFolder.name : "root folder"
      }`}
    >
      <div className="space-y-4">
        {/* File Input */}
        {files.length === 0 && (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="multiple-file-input"
              accept={allowedExtensions.map((ext) => `.${ext}`).join(",")}
            />
            <label
              htmlFor="multiple-file-input"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <Upload className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to browse or drop files here
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: {allowedExtensions.join(", ")}
              </p>
            </label>
          </div>
        )}

        {/* Files List */}
        {files.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
              {uploadingIndex !== null && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading {uploadingIndex + 1} of {files.length}
                </div>
              )}
            </div>

            {uploadedCount > 0 && <Progress value={progress} className="h-2" />}

            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {files.map((fileData, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 md:gap-3 p-3 border rounded-lg ${
                    fileData.status === "success"
                      ? "border-green-500 bg-green-500/5"
                      : fileData.status === "error"
                      ? "border-red-500 bg-red-500/5"
                      : fileData.status === "uploading"
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {fileData.status === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : fileData.status === "error" ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : fileData.status === "uploading" ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <FileIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 overflow-hidden max-w-[220px]  md:max-w-[380px]">
                    <Input
                      value={fileData.title}
                      onChange={(e) => updateFileTitle(index, e.target.value)}
                      disabled={fileData.status !== "pending"}
                      className="mb-1 w-full"
                      placeholder="File title"
                    />
                    <p className="text-xs text-muted-foreground truncate">
                      {(fileData.file.size / 1024).toFixed(1)} KB - <span className="font-medium">{fileData.file.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      
                    </p>
                    {fileData.error && (
                      <p className="text-xs text-destructive mt-1 break-words">
                        {fileData.error}
                      </p>
                    )}
                  </div>

                  {fileData.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0 p-0 has-[>svg]:px-1"
                    >
                      <X />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploadingIndex !== null}
          >
            {allUploaded ? "Close" : "Cancel"}
          </Button>
          {files.length > 0 && !allUploaded && (
            <Button
              onClick={uploadAllFiles}
              disabled={!canUpload || isUploading}
            >
              {uploadingIndex !== null ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload All
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MultipleUploadDialog;
