import React, { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import DocumentEditor from '@/features/editors/document/DocumentEditor'
import SpreadSheetEditor from '@/features/editors/spreadsheet/SpreadSheetEditor'
import { useLoadDocument } from '@/features/editors/hooks/useEditor'
import FullPageLoading from '@/components/common/FullPageLoading'

const IdentifyEditor = () => {
  const { documentId } = useParams();
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(true); // Changed to true so query can run immediately

  // Load document data
  const { isLoading, isError, data: documentData, error } = useLoadDocument(
    documentId, 
    editorRef, 
    isEditorReady
  );



  // Show loading state
  if (isLoading || !documentData) {
    return <FullPageLoading />;
  }
  // Show error state
  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive mb-2">
            Failed to load document
          </h2>
          <p className="text-muted-foreground">
            Please try again or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }


  // Determine which editor to render based on file type
  const fileExtension = documentData?.fileExtension?.toLowerCase();
  const isDocx = fileExtension === 'docx' || fileExtension === 'doc';
  const isSpreadsheet = ['xlsx', 'xls', 'csv'].includes(fileExtension);

  // Render appropriate editor
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

  if (isSpreadsheet) {
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
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          Unsupported File Type
        </h2>
        <p className="text-muted-foreground">
          {fileExtension?.toUpperCase()} files cannot be edited in this viewer.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Supported formats: DOCX, DOC, XLSX, XLS, CSV
        </p>
      </div>
    </div>
  );
};

export default IdentifyEditor;
