import React from "react";
import {
  FolderIcon,
  Edit2,
  Trash2Icon,
  Check,
  X,
  User,
  MapPin,
} from "lucide-react";
import { useFolderCard } from "../hooks/useFolderCard";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getFolderTypeLabel } from "../constants/folderTypes";

const FolderCard = ({
  folder,
  onClick,
  showLocation = false,
  viewMode = "grid",
  onFileDrop,
}) => {
  const {
    contextMenuOpen,
    setContextMenuOpen,
    isRenaming,
    newFolderName,
    setNewFolderName,
    displayName,
    showDeleteModal,
    setShowDeleteModal,
    inputRef,
    canEdit,
    canDelete,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleRenameStart,
    handleRenameConfirm,
    handleRenameCancel,
    handleDeleteClick,
    confirmDelete,
    deleteMutation,
  } = useFolderCard(folder);

  const [isDropTarget, setIsDropTarget] = React.useState(false);

  // Drag handlers
  const handleDragOver = (e) => {
    const isFileCard = e.dataTransfer.types.includes("application/x-file-card");
    
    if (!isFileCard) return;
    
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDropTarget(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropTarget(false);
    
    const isFileCard = e.dataTransfer.types.includes("application/x-file-card");
    
    if (!isFileCard) return;
    
    try {
      const data = e.dataTransfer.getData("application/x-file-card");
      const fileData = JSON.parse(data);
      
      if (onFileDrop) {
        onFileDrop(fileData, folder);
      }
    } catch (error) {
      console.error("Error handling file drop:", error);
    }
  };

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
              className={`relative flex items-center gap-4 p-3 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors border ${
                isDropTarget ? 'border-primary bg-primary/10' : 'border-border'
              }`}
              onClick={() => !isRenaming && onClick(folder)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <FolderIcon
                  className="h-10 w-10 text-primary"
                  fill="currentColor"
                  strokeWidth={1}
                />
              </div>

              {/* Name and details */}
              <div className="flex-1 min-w-0">
                {isRenaming ? (
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
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
                      <span>
                        {folder.subfolder_count || 0} folders •{" "}
                        {folder.document_count || 0} files
                      </span>
                      <span>
                        Type: {getFolderTypeLabel(folder.folder_type)}
                      </span>
                      {showLocation && folder.location && (
                        <span className="truncate">
                          Path: {" "}
                          {folder.location}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Owner avatar */}
              {folder.owner && (
                <div className="flex-shrink-0">
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Avatar className="w-8 h-8 border-2 border-primary bg-muted">
                        <AvatarImage
                          src={folder.owner?.profile}
                          alt={folder.name}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs">
                        Owner: {folder.owner.first_name}{" "}
                        {folder.owner.last_name}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </ContextMenuTrigger>

          {/* Right-Click Context Menu */}
          <ContextMenuContent className="w-48">
            <ContextMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setContextMenuOpen(false);
                setTimeout(() => handleRenameStart(), 0);
              }}
              disabled={!canEdit}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Rename
            </ContextMenuItem>

            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setContextMenuOpen(false);
                  setTimeout(() => handleDeleteClick(), 0);
                }}
                disabled={!canDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </>
          </ContextMenuContent>
        </ContextMenu>

        {/* Delete Confirmation Modal */}
        <DeleteModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onConfirm={confirmDelete}
          itemName={folder.name}
          itemType="folder"
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
                  className={`relative flex flex-col items-center p-4 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors min-h-[140px] ${
                    isDropTarget ? 'bg-primary/10 border-2 border-primary' : ''
                  }`}
                  onClick={() => !isRenaming && onClick(folder)}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                >
                  {/* Icon container with owner avatar */}
                  <div className="flex items-center justify-center mb-2 relative">
                    <FolderIcon
                      className="h-16 w-16 text-primary group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      strokeWidth={1}
                    />
                    {folder.owner && (
                      <Avatar className="absolute -bottom-0 -right-1 w-6 h-6 border-2 border-primary bg-muted z-10 group-hover:scale-110 transition-transform">
                        <AvatarImage
                          src={folder.owner?.profile}
                          alt={folder.name}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>

                  {/* Name with line clamp or input for renaming */}
                  <div className="flex flex-col items-center w-full gap-1">
                    {isRenaming ? (
                      <div className="w-full max-w-[140px] space-y-1">
                        <Input
                          ref={inputRef}
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
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
                        {showLocation && folder.location && (
                          <div className="flex items-center justify-center text-[10px] text-muted-foreground w-full px-1 mt-1">
                            <MapPin className="size-3 flex-shrink-0" />
                            <span className="truncate">{folder.location}</span>
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
                  <div className="text-xs text-gray-300 space-y-0.5">
                    <p>
                      {folder.subfolder_count || 0} folders •{" "}
                      {folder.document_count || 0} files
                    </p>
                    <p>Type: {getFolderTypeLabel(folder.folder_type)}</p>
                    {showLocation && folder.location && (
                      <p>Path: {folder.location}</p>
                    )}
                    {folder.owner && (
                      <p>
                        Owner: {folder.owner.first_name}{" "}
                        {folder.owner.last_name}
                      </p>
                    )}
                    {folder.created_at && (
                      <p>
                        Created:{" "}
                        {new Date(folder.created_at).toLocaleDateString()}
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
              setTimeout(() => handleRenameStart(), 0);
            }}
            disabled={!canEdit}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Rename
          </ContextMenuItem>

          <>
            <ContextMenuSeparator />
            <ContextMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setContextMenuOpen(false);
                setTimeout(() => handleDeleteClick(), 0);
              }}
              disabled={!canDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
            </ContextMenuItem>
          </>
        </ContextMenuContent>
      </ContextMenu>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={confirmDelete}
        itemName={folder.name}
        itemType="folder"
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </TooltipProvider>
  );
};

export default FolderCard;
