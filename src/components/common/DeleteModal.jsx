import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

const DeleteModal = ({
  // Required props
  open = false,
  onOpenChange,
  onConfirm,
  title,
  children,

  // Optional props
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  itemName,
  itemType = "item",
  isLoading = false,

  // Styling props
  icon: Icon = AlertTriangle,
  destructive = true,
  size = "sm", // sm, md, lg

  // Custom classes
  contentClassName = "",
  headerClassName = "",
}) => {
  // Size configurations
  const sizeClasses = {
    sm: "max-w-[400px]",
    md: "max-w-[500px]",
    lg: "max-w-[600px]",
  };

  // Default title and description based on itemName and itemType
  const defaultTitle = title || `Delete ${itemType}`;
  const defaultDescription =
    description ||
    `Are you sure you want to delete ${
      itemName ? `"${itemName}"` : `this ${itemType}`
    }? This action cannot be undone.`;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onOpenChange && !isLoading) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={!isLoading ? onOpenChange : undefined}
    >
      <AlertDialogContent
        className={`${sizeClasses[size]} overflow-hidden p-0 gap-0 ${contentClassName}`}
      >
        <AlertDialogHeader
          className={`px-6 pt-6 pb-4 border-b border-border/50 bg-gradient-to-r from-background via-destructive/5 to-background ${headerClassName}`}
        >
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-lg bg-gradient-to-r from-destructive/20 to-orange-500/20 border border-destructive/30">
                <Icon className="h-5 w-5 text-destructive" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-destructive to-destructive/80 bg-clip-text text-transparent">
                {defaultTitle}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
                {defaultDescription}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        {children && <div className="px-6 py-4">{defaultDescription}</div>}

        <AlertDialogFooter className="px-6 pb-6 pt-4 border-t border-border/50 bg-muted/20">
          <AlertDialogCancel
            onClick={handleCancel}
            disabled={isLoading}
            className="mr-3"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={`min-w-[100px] ${
              destructive
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;
