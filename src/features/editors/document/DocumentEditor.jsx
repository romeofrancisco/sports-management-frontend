import React from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Print,
} from "@syncfusion/ej2-react-documenteditor";
import { useSaveDocument } from "@/features/editors/hooks/useEditor";
import {
  EDITOR_SETTINGS,
  EDITOR_TOOLBAR_CONFIG,
  SYNCFUSION_DOCUMENT_SERVICE_URL,
} from "../constants/editorConfig";
import {
  handleSave,
  handlePrint,
  handleEditorCreated,
  handleToolbarClick,
} from "./handlers/documentEditorHandlers";

DocumentEditorContainerComponent.Inject(Toolbar, Print);

const DocumentEditor = ({
  documentId,
  documentData,
  editorRef,
  setIsEditorReady,
}) => {
  // Hooks
  const saveMutation = useSaveDocument();

  // Permission flags
  const canEdit = documentData?.canEdit ?? false;
  const isPublic = documentData?.isPublic ?? false;

  // Handler callbacks
  const onSave = () => {
    handleSave({
      canEdit,
      isPublic,
      saveMutation,
      editorRef,
      documentId,
      fileExtension: documentData?.fileExtension,
    });
  };

  const onPrint = () => {
    handlePrint(editorRef);
  };

  const onEditorCreated = () => {
    handleEditorCreated(editorRef, setIsEditorReady);
  };

  const onToolbarClick = (args) => {
    handleToolbarClick(args, { onSave, onPrint });
  };

  return (
    <DocumentEditorContainerComponent
      id="container"
      ref={editorRef}
      height={"calc(100vh - 64px)"}
      serviceUrl={SYNCFUSION_DOCUMENT_SERVICE_URL}
      documentEditorSettings={EDITOR_SETTINGS}
      enableToolbar={true}
      toolbarClick={onToolbarClick}
      toolbarItems={EDITOR_TOOLBAR_CONFIG}
      created={onEditorCreated}
      showPropertiesPane={true}
    />
  );
};

export default DocumentEditor;
