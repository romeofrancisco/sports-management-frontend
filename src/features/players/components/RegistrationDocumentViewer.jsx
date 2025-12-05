import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Image as ImageIcon,
  File,
  FileSpreadsheet,
  AlertCircle,
  X,
  Printer,
} from "lucide-react";

/**
 * Get file extension from file_extension field or URL
 */
const getFileExtension = (doc) => {
  // First try file_extension field from backend
  if (doc?.file_extension) {
    return doc.file_extension.replace(".", "").toLowerCase();
  }

  // Fallback to extracting from URL
  const url = doc?.file_url || doc?.file || "";
  if (!url) return "";

  const cleanUrl = url.split("?")[0];
  const parts = cleanUrl.split(".");
  return parts[parts.length - 1]?.toLowerCase() || "";
};

/**
 * Get file type category from document
 */
const getFileType = (doc) => {
  const ext = getFileExtension(doc);

  if (["pdf"].includes(ext)) return "pdf";
  if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext))
    return "image";
  if (["doc", "docx"].includes(ext)) return "document";
  if (["xls", "xlsx", "csv"].includes(ext)) return "spreadsheet";
  if (["ppt", "pptx"].includes(ext)) return "presentation";
  if (["txt", "html"].includes(ext)) return "text";
  return "other";
};

/**
 * Get the preview URL - uses Microsoft Office Online Viewer for documents
 * Backend already provides the correct preview_url with Office Online format
 */
const getPreviewUrl = (doc, fileType) => {
  // Backend provides preview_url with Microsoft Office Online Viewer format
  if (doc?.preview_url) {
    return doc.preview_url;
  }

  // Fallback: construct Office Online URL from file_url
  const fileUrl = doc?.file_url || doc?.file;
  if (!fileUrl) return null;

  // For images, return direct URL
  if (fileType === "image") {
    return fileUrl;
  }

  if (fileType === "pdf") {
    return fileUrl;
  }

  // For Office documents and PDFs, use Microsoft Office Online Viewer
  if (["document", "spreadsheet", "presentation"].includes(fileType)) {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
      fileUrl
    )}`;
  }

  return fileUrl;
};

/**
 * Get the download URL
 */
const getDownloadUrl = (doc) => {
  // Prefer download_url from backend
  if (doc?.download_url) {
    return doc.download_url;
  }
  return doc?.file_url || doc?.file;
};

/**
 * Get the view URL for opening in new tab
 */
const getViewUrl = (doc) => {
  return doc?.file_url || doc?.file;
};

/**
 * Get file type icon
 */
const getFileIcon = (fileType) => {
  switch (fileType) {
    case "image":
      return ImageIcon;
    case "spreadsheet":
      return FileSpreadsheet;
    case "pdf":
    case "document":
    case "presentation":
      return FileText;
    default:
      return File;
  }
};

/**
 * Image Preview Component with zoom and rotate controls
 */
const ImagePreview = ({ src, alt }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 bg-[#525659]">
        <AlertCircle className="size-16 text-white/60" />
        <p className="text-white/80">Failed to load image</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#525659]">
      {/* Image Container */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-200"
          style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>

      {/* Bottom Toolbar - Google Style */}
      <div className="flex items-center justify-center gap-2 p-3 bg-[#3c4043] text-white">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 25}
          className="text-white hover:bg-white/10"
        >
          <ZoomOut className="size-4" />
        </Button>
        <span className="text-sm min-w-[50px] text-center">{zoom}%</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 300}
          className="text-white hover:bg-white/10"
        >
          <ZoomIn className="size-4" />
        </Button>
        <div className="w-px h-4 bg-white/30 mx-2" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRotate}
          className="text-white hover:bg-white/10"
        >
          <RotateCw className="size-4" />
        </Button>
      </div>
    </div>
  );
};

/**
 * Document Preview Component using Google gview
 */
const DocumentPreview = ({ previewUrl, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 bg-[#525659]">
        <AlertCircle className="size-16 text-white/60" />
        <p className="text-white/80">Could not load the document preview</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#525659]">
      {/* Iframe Container */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-sm text-white/70">Loading document...</span>
            </div>
          </div>
        )}
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title={title}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      </div>
    </div>
  );
};

/**
 * Fallback Preview for unsupported types
 */
const FallbackPreview = ({ document, fileType }) => {
  const FileIcon = getFileIcon(fileType);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8 bg-[#525659]">
      <div className="p-6 rounded-full bg-white/10">
        <FileIcon className="size-16 text-white/60" />
      </div>
      <div className="text-center space-y-2">
        <p className="font-semibold text-lg text-white">{document.title}</p>
        <p className="text-sm text-white/60">
          Preview not available for this file type
        </p>
      </div>
    </div>
  );
};

/**
 * Document Viewer Page - Google Classroom Style
 * Uses React Portal to render as independent full-page overlay
 * Supports Google Drive documents with preview/download URLs
 */
const RegistrationDocumentViewer = ({
  open,
  onOpenChange,
  document: doc,
  registrationInfo,
}) => {
  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      // Prevent body scroll when viewer is open
      window.document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || !doc) return null;

  // Check if document has any viewable content
  const hasContent = doc.file || doc.file_url || doc.preview_url;
  if (!hasContent) return null;

  const fileType = getFileType(doc);
  const previewUrl = getPreviewUrl(doc, fileType);
  const downloadUrl = getDownloadUrl(doc);
  const viewUrl = getViewUrl(doc);
  const FileIcon = getFileIcon(fileType);
  const fileExt = getFileExtension(doc);

  const getFileTypeLabel = () => {
    switch (fileType) {
      case "pdf":
        return "PDF";
      case "document":
        return "Word Document";
      case "spreadsheet":
        return "Spreadsheet";
      case "presentation":
        return "Presentation";
      case "image":
        return "Image";
      case "text":
        return "Text File";
      default:
        return "File";
    }
  };

  const renderPreview = () => {
    // Images - use direct <img> tag
    if (fileType === "image") {
      const imageSrc = doc.file_url || doc.file || previewUrl;
      return <ImagePreview src={imageSrc} alt={doc.title} />;
    }

    // Documents with preview URL (Google Drive or gview)
    if (previewUrl) {
      return <DocumentPreview previewUrl={previewUrl} title={doc.title} />;
    }

    // Fallback for unsupported types
    return <FallbackPreview document={doc} fileType={fileType} />;
  };

  // Use createPortal to render at document body level
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex flex-col bg-background">
      {/* Mobile Header - Only visible on small screens */}
      <div className="flex items-center justify-between p-3 border-b lg:hidden bg-background shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="p-1.5 rounded bg-primary/10 shrink-0">
            <FileIcon className="size-4 text-primary" />
          </div>
          <span className="font-medium text-sm truncate">{doc.title}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => downloadUrl && window.open(downloadUrl, "_blank")}
            disabled={!downloadUrl}
          >
            <Download className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Preview Area */}
        <div className="flex-1 bg-[#525659] overflow-hidden min-h-[50vh] lg:min-h-0">
          {renderPreview()}
        </div>

        {/* Sidebar - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex w-[320px] bg-background border-l flex-col overflow-hidden shrink-0">
          {/* Close button for desktop */}
          <div className="flex items-center justify-end p-2 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Document Info Header */}
          <div className="p-4 border-b">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <FileIcon className="size-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-lg leading-tight line-clamp-2">
                  {doc.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {getFileTypeLabel()}
                </p>
              </div>
            </div>
          </div>

          {/* Document Details */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Document Type */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Document Type
              </h3>
              <Badge variant="secondary" className="capitalize">
                {doc.document_type_display ||
                  doc.document_type?.replace(/_/g, " ") ||
                  "Document"}
              </Badge>
            </div>

            <Separator />

            {/* Registration Info */}
            {registrationInfo && (
              <>
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Submitted By
                  </h3>
                  <p className="font-medium">{registrationInfo.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {registrationInfo.email}
                  </p>
                </div>
                <Separator />
              </>
            )}

            {/* File Info */}
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                File Information
              </h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  {getFileTypeLabel()}
                </p>
                {fileExt && (
                  <p>
                    <span className="text-muted-foreground">Extension:</span> .
                    {fileExt}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t space-y-2 shrink-0">
            <Button
              className="w-full"
              onClick={() => downloadUrl && window.open(downloadUrl, "_blank")}
              disabled={!downloadUrl}
            >
              <Download className="size-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Mobile Bottom Sheet - Only visible on small screens */}
        <div className="lg:hidden bg-background border-t p-3 shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize shrink-0">
              {doc.document_type_display ||
                doc.document_type?.replace(/_/g, " ") ||
                "Document"}
            </Badge>
            <span className="text-xs text-muted-foreground truncate flex-1">
              {getFileTypeLabel()} {fileExt && `(.${fileExt})`}
            </span>
          </div>
          {registrationInfo && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Submitted by {registrationInfo.full_name}
            </p>
          )}
        </div>
      </div>
    </div>,
    window.document.body
  );
};

export default RegistrationDocumentViewer;
