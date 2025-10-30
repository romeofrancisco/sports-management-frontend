import React from "react";
import {
  DownloadIcon,
  CopyIcon,
  Trash2Icon,
  Edit2,
  Check,
  X,
  MapPin,
} from "lucide-react";
import { useFileCard } from "../hooks/useFileCard";
import DeleteModal from "@/components/common/DeleteModal";
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

const FileCard = ({
  file,
  currentFolder,
  rootData,
  showLocation = false,
  onCopy,
  viewMode = "grid",
}) => {
  const {
    contextMenuOpen,
    setContextMenuOpen,
    isRenaming,
    newFileName,
    setNewFileName,
    displayName,
    showDeleteModal,
    setShowDeleteModal,
    inputRef,
    canEdit,
    canDelete,
    canCopy,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleDownload,
    handleCopy,
    handleRenameStart,
    handleRenameConfirm,
    handleRenameCancel,
    handleDeleteClick,
    confirmDelete,
    formatFileSize,
    formatDate,
    getFileExtension,
    getFileIcon,
    deleteMutation,
  } = useFileCard(file, currentFolder, rootData, onCopy);

  const fileIcon = getFileIcon();

  // List view rendering
  if (viewMode === "list") {
    return (
      <TooltipProvider>
        <ContextMenu
          modal={false}
          open={contextMenuOpen}
          onOpenChange={setContextMenuOpen}
        >
          <ContextMenuTrigger asChild>
            <div
              className="relative flex items-center gap-4 p-3 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors border border-border"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {fileIcon.type === "image" ? (
                  <img
                    src={fileIcon.src}
                    alt={displayName}
                    className="h-10 w-10 object-cover rounded"
                  />
                ) : (
                  <img
                    src={fileIcon.src}
                    alt={getFileExtension()}
                    className="h-10 w-10 object-contain"
                  />
                )}
              </div>

              {/* Name and details */}
              <div className="flex-1 min-w-0">
                {isRenaming ? (
                  <div className="flex items-center gap-2">
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
                      className="h-8 text-sm max-w-xs"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameConfirm();
                      }}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRenameCancel();
                      }}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground truncate">
                      {displayName}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 text-xs text-muted-foreground mt-1">
                      <span>{formatFileSize(file.file_size)}</span>
                      <span>{formatDate(file.uploaded_at)}</span>
                      {showLocation && file.location && (
                        <span className="truncate">Path: {file.location}</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex-shrink-0 flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  <DownloadIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </ContextMenuTrigger>

          {/* Right-Click Context Menu */}
          <ContextMenuContent className="w-48">
            <ContextMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setContextMenuOpen(false);
                setTimeout(() => handleDownload(), 0);
              }}
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </ContextMenuItem>
            {canCopy && file.status !== "copy" && (
              <ContextMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setContextMenuOpen(false);
                  setTimeout(() => handleCopy(), 0);
                }}
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy
              </ContextMenuItem>
            )}
            {canEdit && (
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
            {canDelete && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setContextMenuOpen(false);
                    setTimeout(() => handleDeleteClick(), 0);
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

        {/* Delete Confirmation Modal */}
        <DeleteModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onConfirm={confirmDelete}
          itemName={file.title}
          itemType="document"
          isLoading={deleteMutation.isPending}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </TooltipProvider>
    );
  }

  // Grid view rendering (original code)
  return (
    <TooltipProvider>
      <ContextMenu
        modal={false}
        open={contextMenuOpen}
        onOpenChange={setContextMenuOpen}
      >
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
                    {fileIcon.type === "image" ? (
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
                      <>
                        <p className="text-sm font-medium text-center text-foreground line-clamp-4 max-w-[140px] break-words leading-tight">
                          {displayName}
                        </p>
                        {showLocation && file.location && (
                          <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground w-full px-1 mt-1">
                            <MapPin className="size-3 flex-shrink-0" />
                            <span className="truncate">{file.location}</span>
                          </div>
                        )}
                      </>
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
                    {showLocation && file.location && (
                      <p>Path: {file.location}</p>
                    )}
                    {file.uploaded_by && (
                      <p>
                        By: {file.uploaded_by.first_name}{" "}
                        {file.uploaded_by.last_name}
                      </p>
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
              setTimeout(() => handleDownload(), 0);
            }}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </ContextMenuItem>
          {canCopy && file.status !== "copy" && (
            <ContextMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setContextMenuOpen(false);
                setTimeout(() => handleCopy(), 0);
              }}
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy
            </ContextMenuItem>
          )}
          {canEdit && (
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
          {canDelete && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setContextMenuOpen(false);
                  setTimeout(() => handleDeleteClick(), 0);
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

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={confirmDelete}
        itemName={file.title}
        itemType="document"
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </TooltipProvider>
  );
};

export default FileCard;
