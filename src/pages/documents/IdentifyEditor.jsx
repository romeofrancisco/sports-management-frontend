import React from "react";
import { useParams } from "react-router-dom";
import { GoogleDocEditor, GoogleSheetEditor } from "@/features/editors/google";
import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import FullPageLoading from "@/components/common/FullPageLoading";
import PageError from "../PageError";
import { FileX } from "lucide-react";

// File extension constants (without dots, lowercase)
const WORD_EXTENSIONS = ["doc", "docx"];
const EXCEL_EXTENSIONS = ["xls", "xlsx"];

const IdentifyEditor = () => {
  const { documentId } = useParams();

  // Fetch document info to determine file type
  const {
    isLoading,
    isError,
    data: documentData,
    error,
  } = useQuery({
    queryKey: ["document-info", documentId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/files/${documentId}/`);
      if (!data) throw new Error("Document not found");
      return data;
    },
    enabled: !!documentId,
  });

  console.log("Document Data:", documentData);

  // Show loading state
  if (isLoading) return <FullPageLoading />;

  // Show error
  if (isError || !documentData)
    return <PageError error={error} onReset={() => window.location.reload()} />;

  // Determine which editor to render based on file type
  // Handle both ".docx" and "DOCX" formats from backend
  const rawExtension = documentData?.file_extension || "";
  const fileExtension = rawExtension.replace(/^\./, "").toLowerCase()
  const isDocx = WORD_EXTENSIONS.includes(fileExtension);
  const isExcel = EXCEL_EXTENSIONS.includes(fileExtension);



  // Render Google Docs editor for Word documents
  if (isDocx) {
    return <GoogleDocEditor documentId={documentId} />;
  }

  // Render Google Sheets editor for Excel documents
  if (isExcel) {
    return <GoogleSheetEditor documentId={documentId} />;
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
          Supported formats: DOCX, DOC, XLSX, XLS
        </p>
      </div>
    </div>
  );
};

export default IdentifyEditor;
