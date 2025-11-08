import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import DocumentEditor from "@/features/editors/document/DocumentEditor";
import SpreadSheetEditor from "@/features/editors/spreadsheet/SpreadSheetEditor";
import { useLoadDocument } from "@/features/editors/hooks/useEditor";
import FullPageLoading from "@/components/common/FullPageLoading";
import PageError from "../PageError";
import { FileX } from "lucide-react";
import { FILE_EXTENSIONS } from "@/features/editors/constants/fileTypes";

const IdentifyEditor = () => {
  const { documentId } = useParams();
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(true); // Changed to true so query can run immediately

  // Load document data
  const {
    isLoading,
    isError,
    data: documentData,
    error,
  } = useLoadDocument(documentId, editorRef, isEditorReady);

  // Show loading state
  if (isLoading) return <FullPageLoading />;

  // Show error
  if (isError || !documentData)
    return <PageError error={error} onReset={() => window.location.reload()} />;

  // Determine which editor to render based on file type
  const fileExtension = documentData?.fileExtension?.toLowerCase();
  const isDocx = FILE_EXTENSIONS.WORD.includes(fileExtension);
  const isExcel = FILE_EXTENSIONS.EXCEL.includes(fileExtension);

  //Render appropriate editor
  if (isDocx) {
    return (
      <DocumentEditor
        documentId={documentId}
        documentData={documentData}
        editorRef={editorRef}
        isEditorReady={isEditorReady}
        setIsEditorReady={setIsEditorReady}
      />
    );
  }

  if (isExcel) {
    return (
      <SpreadSheetEditor
        documentId={documentId}
        documentData={documentData}
        editorRef={editorRef}
        isEditorReady={isEditorReady}
        setIsEditorReady={setIsEditorReady}
      />
    );
  }

  // Fallback for unsupported file types
  return (
    <div className="flex min-h-[calc(100dvh-64px)] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center place-items-center">
        <FileX className="size-20" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Unsupported File Type
        </h1>
        <p className="mt-2">
          {fileExtension?.toUpperCase()} files cannot be edited in this viewer.
        </p>
        <p className="mt-4 text-muted-foreground">
          Supported formats: DOCX, DOC, XLSX, XLS, CSV
        </p>
      </div>
    </div>
  );
};

export default IdentifyEditor;
