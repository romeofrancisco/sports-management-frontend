import React from "react";
import {
  DocumentEditorContainerComponent,
  Toolbar,
  Print,
  Ribbon,
  WordExport,
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
  handleDownload,
} from "./handlers/documentEditorHandlers";

DocumentEditorContainerComponent.Inject(Toolbar, Print, Ribbon, WordExport);

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
      fileName: documentData?.fileName,
    });
  };

  const onPrint = () => {
    handlePrint(editorRef);
  };

  const onDownload = () => {
    handleDownload(editorRef, documentData?.fileName);
  };

  const onEditorCreated = () => {
    handleEditorCreated(editorRef, setIsEditorReady);
  };

  const onFileMenuItemSelect = (args) => {
    handleFileMenuItemSelect(args, { onSave, onPrint, onDownload });
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
        { text: "Print", id: "print", iconCss: "e-icons e-print" },
        { text: "Save", id: "save", iconCss: "e-icons e-save" },
        { text: "Download", id: "download", iconCss: "e-icons e-download" },
      ]}
      created={onEditorCreated}
      showPropertiesPane={true}
      toolbarMode="Ribbon"
      enableSfdtExport={true}
      enableWordExport={true}
    />
  );
};

export default DocumentEditor;
