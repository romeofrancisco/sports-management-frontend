import { toast } from "sonner";
import { TOOLBAR_ACTIONS } from "../../constants/documentConfig";

export const handleSave = ({ canEdit, isPublic, saveMutation, editorRef, documentId, fileExtension, fileName }) => {
  if (!canEdit) {
    toast.error("Cannot save changes", {
      richColors: true,
      description: isPublic
        ? "This is a public document. Please make a copy to save your changes."
        : "You don't have permission to save changes to this document.",
    });
    return;
  }
  saveMutation.mutate({ editorRef, documentId, fileExtension, fileName });
};

export const handlePrint = (editorRef) => {
  if (editorRef.current) {
    editorRef.current.documentEditor.print();
  }
};

export const handleDownload = (editorRef, fileName) => {
  if (editorRef.current) {
    const docName = fileName?.replace(/\.[^/.]+$/, "") || "Document";
    console.log("Downloading document:", docName);
    editorRef.current.documentEditor.save(docName, "Docx");
  } else {
    console.error("Editor reference is not available for download");
  }
};

export const handleEditorCreated = (editorRef, setIsEditorReady) => {
  setIsEditorReady(true);

  if (editorRef.current) {
    // Configure editor settings
    editorRef.current.documentEditor.documentEditorSettings.showRuler = true;
    console.log(editorRef.current)

    // Track document changes
    editorRef.current.documentEditor.documentChange = () => {
      editorRef.current.documentEditor.isDocumentChanged = true;
    };
  }
};


export const handleFileMenuItemSelect = (args, handlers) => {
  switch (args.item.id) {
    case TOOLBAR_ACTIONS.SAVE:
      handlers.onSave();
      break;
    case TOOLBAR_ACTIONS.PRINT:
      handlers.onPrint();
      break;
    case TOOLBAR_ACTIONS.DOWNLOAD:
      handlers.onDownload();
      break;
    default:
      break;
  }
};
