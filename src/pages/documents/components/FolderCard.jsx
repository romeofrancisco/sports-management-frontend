import React, { useState, useRef, useEffect } from "react";
import { FolderIcon, Edit2, Trash2Icon, Check, X } from "lucide-react";
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
import { User } from "lucide-react";

const FolderCard = ({ folder, onClick, onRename, onDelete, canEdit, canDelete }) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFolderName, setNewFolderName] = useState(folder.name);
  const [displayName, setDisplayName] = useState(folder.name);
  const inputRef = useRef(null);
  const longPressTimerRef = useRef(null);

  // Update displayName when folder.name changes (after successful mutation)
  useEffect(() => {
    setDisplayName(folder.name);
    setNewFolderName(folder.name);
  }, [folder.name]);

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

  const handleRenameStart = () => {
    setIsRenaming(true);
    setNewFolderName(displayName);
  };

  const handleRenameConfirm = () => {
    if (newFolderName.trim() && newFolderName !== displayName) {
      setDisplayName(newFolderName.trim()); // Update display immediately
      onRename(folder.id, newFolderName.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = () => {
    setIsRenaming(false);
    setNewFolderName(displayName);
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
                  className="relative flex flex-col items-center p-4 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors min-h-[140px]"
                  onClick={() => !isRenaming && onClick(folder)}
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
                        <AvatarImage src={folder.owner?.profile} alt={folder.name} />
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
                      <p className="text-sm font-medium text-center text-foreground line-clamp-4 max-w-[140px] break-words leading-tight">
                        {displayName}
                      </p>
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
                    {folder.owner && (
                      <p>
                        Owner: {folder.owner.first_name} {folder.owner.last_name}
                      </p>
                    )}
                    {folder.created_at && (
                      <p>
                        Created: {new Date(folder.created_at).toLocaleDateString()}
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
          {onRename && (
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
          )}
          {canDelete && onDelete && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setContextMenuOpen(false);
                  setTimeout(() => onDelete(folder), 0);
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

export default FolderCard;
