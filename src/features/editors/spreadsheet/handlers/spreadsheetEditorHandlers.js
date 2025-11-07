import { toast } from "sonner";

export const handleSave = ({ canEdit, isPublic, saveMutation, editorRef, documentId, fileExtension }) => {
  if (!canEdit) {
    toast.error("Cannot save changes", {
      richColors: true,
      description: isPublic
        ? "This is a public document. Please make a copy to save your changes."
        : "You don't have permission to save changes to this document.",
    });
    return;
  }
  saveMutation.mutate({ editorRef, documentId, fileExtension });
};

export const handleFileMenuItemSelect = (args, handlers) => {
  switch (args.item.id) {
    case "save":
      handlers.onSave();
      break;
    default:
      break;
  }
};
