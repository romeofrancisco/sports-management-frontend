import React, { useState, useRef, useEffect } from "react";
import { FileTextIcon, DownloadIcon, CopyIcon, Trash2Icon, Edit2, Check, X } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import docx from "@/assets/documents/docx.png"
import pdf from "@/assets/documents/pdf.png"
import pptx from "@/assets/documents/pptx.png"
import xlsx from "@/assets/documents/xlsx.png"
import txt from "@/assets/documents/txt.png"
import csv from "@/assets/documents/csv.png"
import defaultFile from "@/assets/documents/default.png"

const   FileCard = ({ file, onDownload, onCopy, onRename, onDelete, canEdit, canDelete }) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFileName, setNewFileName] = useState(file.title);
  const [displayName, setDisplayName] = useState(file.title);
  const inputRef = useRef(null);
  const longPressTimerRef = useRef(null);

  // Update displayName when file.title changes (after successful mutation)
  useEffect(() => {
    setDisplayName(file.title);
    setNewFileName(file.title);
  }, [file.title]);

  // Long press handlers for mobile
  const handleTouchStart = (e) => {
    longPressTimerRef.current = setTimeout(() => {
      setContextMenuOpen(true);
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  const handleTouchMove = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get file extension from title
  const getFileExtension = () => {
    // Use the file_extension from backend if available
    if (file.file_extension) {
      return file.file_extension;
    }
    // Fallback to extracting from title if needed
    const parts = file.title.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
  };

  // Get icon based on file extension
  const getFileIcon = () => {
    const extension = file.file_extension ? file.file_extension.toLowerCase() : "";
    
    // Check if it's an image
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    if (imageExtensions.includes(extension)) {
      return { type: 'image', src: file.file };
    }
    
    // Return appropriate icon for document types
    switch (extension) {
      case 'pdf':
        return { type: 'icon', src: pdf };
      case 'doc':
      case 'docx':
        return { type: 'icon', src: docx };
      case 'xls':
      case 'xlsx':
        return { type: 'icon', src: xlsx };
      case 'ppt':
      case 'pptx':
        return { type: 'icon', src: pptx };
      case 'txt':
        return { type: 'icon', src: txt };
      case 'csv':
        return { type: 'icon', src: csv };
      default:
        return { type: 'icon', src: defaultFile };
    }
  };

  const fileIcon = getFileIcon();

  const handleRenameStart = () => {
    setIsRenaming(true);
    setNewFileName(displayName);
  };

  const handleRenameConfirm = () => {
    if (newFileName.trim() && newFileName !== displayName) {
      setDisplayName(newFileName.trim()); // Update display immediately
      onRename(file.id, newFileName.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setNewFileName(displayName);
  };

  // Focus input when rename mode starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  // Cleanup long press timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  return (
    <TooltipProvider>
      <ContextMenu modal={false} open={contextMenuOpen} onOpenChange={setContextMenuOpen}>
        <ContextMenuTrigger asChild>
          <div className="relative group">
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <div 
                  className="flex flex-col items-center p-4 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors min-h-[140px]"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                >
                  {/* Icon with extension badge */}
                  <div className="flex items-center justify-center mb-3 relative">
                    {fileIcon.type === 'image' ? (
                      <img 
                        src={fileIcon.src} 
                        alt={displayName}
                        className="h-16 w-16 object-cover rounded group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <img 
                        src={fileIcon.src} 
                        alt={getFileExtension()}
                        className="h-16 w-16 object-contain group-hover:scale-110 transition-transform"
                      />
                    )}
                  </div>
                  
                  {/* Name with line clamp or input for renaming */}
                  <div className="flex flex-col items-center w-full gap-1">
                    {isRenaming ? (
                      <div className="w-full max-w-[140px] space-y-1">
                        <Input
                          ref={inputRef}
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRenameConfirm();
                            } else if (e.key === "Escape") {
                              handleRenameCancel();
                            }
                          }}
                          className="h-7 text-xs text-center px-2"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex justify-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameConfirm();
                            }}
                          >
                            <Check className="h-3 w-3 text-green-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameCancel();
                            }}
                          >
                            <X className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-center text-foreground line-clamp-4 max-w-[140px] break-words leading-tight">
                        {displayName}
                      </p>
                    )}
                    
                    {file.status === "copy" && (
                      <span className="mt-1 text-[10px] text-orange-500 font-medium">COPY</span>
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold">{displayName}</p>
                  {file.description && (
                    <p className="text-xs text-gray-300">{file.description}</p>
                  )}
                  <div className="text-xs text-gray-300 space-y-0.5 pt-1 border-t">
                    <p>Size: {formatFileSize(file.file_size)}</p>
                    <p>Modified: {formatDate(file.uploaded_at)}</p>
                    {file.uploaded_by && (
                      <p>By: {file.uploaded_by.first_name} {file.uploaded_by.last_name}</p>
                    )}
                    {file.status === "copy" && (
                      <p className="text-orange-500">Status: Copy</p>
                    )}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </ContextMenuTrigger>

        {/* Right-Click Context Menu */}
        <ContextMenuContent className="w-48">
          <ContextMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setContextMenuOpen(false);
              setTimeout(() => onDownload(file), 0);
            }}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </ContextMenuItem>
          {onCopy && file.status !== "copy" && (
            <ContextMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setContextMenuOpen(false);
                setTimeout(() => onCopy(file), 0);
              }}
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy to My Folder
            </ContextMenuItem>
          )}
          {onRename && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setContextMenuOpen(false);
                  setTimeout(() => handleRenameStart(), 0);
                }}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Rename
              </ContextMenuItem>
            </>
          )}
          {canDelete && onDelete && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setContextMenuOpen(false);
                  setTimeout(() => onDelete(file), 0);
                }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </TooltipProvider>
  );
};

export default FileCard;
