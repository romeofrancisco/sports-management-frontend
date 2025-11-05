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
} from "./constants/editorConfig";
import {
  handleSave,
  handlePrint,
  handleEditorCreated,
  handleToolbarClick,
} from "./handlers/documentEditorHandlers";
import FullPageLoading from "@/components/common/FullPageLoading";

DocumentEditorContainerComponent.Inject(Toolbar, Print);

const DocumentEditor = () => {
  // Hooks
  const { documentId } = useParams();
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = React.useState(false);

  const { isLoading, isError, data: documentData} = useLoadDocument(documentId, editorRef, isEditorReady);
  const saveMutation = useSaveDocument();

  // Permission flags
  const canEdit = documentData?.canEdit ?? false;
  const isPublic = documentData?.isPublic ?? false;

  // Handler callbacks
  const onSave = () => {
    handleSave({ canEdit, isPublic, saveMutation, editorRef, documentId });
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
          toolbarClick={onToolbarClick}
          toolbarItems={EDITOR_TOOLBAR_CONFIG}
          created={onEditorCreated}
          showPropertiesPane={false}
        />
      )}
    </>
  );
};

export default DocumentEditor;
