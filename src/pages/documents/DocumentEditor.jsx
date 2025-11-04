import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Print,
} from "@syncfusion/ej2-react-documenteditor";
import { toast } from "sonner";
import { useLoadDocument, useSaveDocument } from "@/hooks/useDocumentEditor";
import {
  EDITOR_SETTINGS,
  EDITOR_TOOLBAR_CONFIG,
  SYNCFUSION_SERVICE_URL,
  TOOLBAR_ACTIONS,
} from "./constants/editorConfig";
import FullPageLoading from "@/components/common/FullPageLoading";

DocumentEditorContainerComponent.Inject(Toolbar, Print);

// ============================================================================
// COMPONENT
// ============================================================================

const DocumentEditor = () => {
  // Hooks
  const { documentId } = useParams();
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = React.useState(false);

  const {
    isLoading,
    isError,
    error,
    data: documentData,
  } = useLoadDocument(documentId, editorRef, isEditorReady);
  const saveMutation = useSaveDocument();

  // Permission flags
  const canEdit = documentData?.canEdit ?? false;
  const isPublic = documentData?.isPublic ?? false;

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleSave = () => {
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

  const handlePrint = () => {
    if (editorRef.current) {
      editorRef.current.documentEditor.print();
    }
  };

  const handleEditorCreated = () => {
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

const handleWrapText = (style) => {
  const editor = editorRef.current?.documentEditor;
  if (!editor) return;

  const sel = editor.selection;
  if (!sel.isImageSelected) {
    toast.error("Select an image first");
    return;
  }

  const imgFmt = sel.imageFormat;
  imgFmt.textWrappingStyle = style;  // e.g. "TopAndBottom", "Behind", "Square", "InFrontOfText", "Inline"
  editor.editorModule.setImageProperties(imgFmt);
};

  const handleToolbarClick = (args) => {
    switch (args.item.id) {
      case TOOLBAR_ACTIONS.SAVE:
        handleSave();
        break;
      case TOOLBAR_ACTIONS.PRINT:
        handlePrint();
        break;
      case TOOLBAR_ACTIONS.WRAP_TEXT:
        handleWrapText();
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* Loading State */}
      {isLoading && <FullPageLoading />}

      {/* Editor */}
      {!isLoading && !isError && (
        <DocumentEditorContainerComponent
          id="container"
          ref={editorRef}
          height={"calc(100vh - 64px)"}
          serviceUrl={SYNCFUSION_SERVICE_URL}
          documentEditorSettings={EDITOR_SETTINGS}
          enableToolbar={true}
          toolbarClick={handleToolbarClick}
          toolbarItems={EDITOR_TOOLBAR_CONFIG}
          created={handleEditorCreated}
          showPropertiesPane={false}
        />
      )}

      {/* Error State */}
    </>
  );
};

export default DocumentEditor;
