import { toast } from "sonner";
import { TOOLBAR_ACTIONS } from "../../constants/editorConfig";

export const handleSave = ({ canEdit, isPublic, saveMutation, editorRef, documentId }) => {
  if (!canEdit) {
    toast.error("Cannot save changes", {
      richColors: true,
      description: isPublic
        ? "This is a public document. Please make a copy to save your changes."
        : "You don't have permission to save changes to this document.",
    });
    return;
  }
  saveMutation.mutate({ editorRef, documentId });
};

export const handlePrint = (editorRef) => {
  if (editorRef.current) {
    editorRef.current.documentEditor.print();
  }
};

export const handleEditorCreated = (editorRef, setIsEditorReady) => {
  setIsEditorReady(true);

  if (editorRef.current) {
    // Configure editor settings
    editorRef.current.documentEditor.documentEditorSettings.showRuler = true;

    // Track document changes
    editorRef.current.documentEditor.documentChange = () => {
      editorRef.current.documentEditor.isDocumentChanged = true;
    };
  }
};


export const handleToolbarClick = (args, handlers) => {
  switch (args.item.id) {
    case TOOLBAR_ACTIONS.SAVE:
      handlers.onSave();
      break;
    case TOOLBAR_ACTIONS.PRINT:
      handlers.onPrint();
      break;
    default:
      break;
  }
};
