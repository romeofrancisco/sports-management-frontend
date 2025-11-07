import React from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Print,
  Ribbon,
} from "@syncfusion/ej2-react-documenteditor";
import { useSaveDocument } from "@/features/editors/hooks/useEditor";
import {
  EDITOR_SETTINGS,
  EDITOR_TOOLBAR_CONFIG,
  SYNCFUSION_DOCUMENT_SERVICE_URL,
} from "../constants/documentConfig";
import {
  handleSave,
  handlePrint,
  handleEditorCreated,
  handleFileMenuItemSelect,
} from "./handlers/documentEditorHandlers";

DocumentEditorContainerComponent.Inject(Toolbar, Print, Ribbon);

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

  const onFileMenuItemSelect = (args) => {
    handleFileMenuItemSelect(args, { onSave, onPrint });
  };

  return (
    <DocumentEditorContainerComponent
      id="container"
      ref={editorRef}
      height={"calc(100vh - 64px)"}
      serviceUrl={SYNCFUSION_DOCUMENT_SERVICE_URL}
      documentEditorSettings={EDITOR_SETTINGS}
      enableToolbar={true}
      fileMenuItemClick={onFileMenuItemSelect}
      fileMenuItems={[
        "New",
        { text: "Print", id: "print", iconCss: "e-icons e-print" },
        { text: "Save", id: "save", iconCss: "e-icons e-save" },
      ]}
      created={onEditorCreated}
      showPropertiesPane={true}
      toolbarMode="Ribbon"
    />
  );
};

export default DocumentEditor;
