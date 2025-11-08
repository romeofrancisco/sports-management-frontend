import React from "react";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { useSaveDocument } from "@/features/editors/hooks/useEditor";
import {
  handleSave,
  handleFileMenuItemSelect,
} from "./handlers/spreadsheetEditorHandlers";
import { AlertDialog } from "@/components/ui/alert-dialog";

const SpreadSheetEditor = ({ editorRef, documentId, documentData }) => {
  // Hooks
  const saveMutation = useSaveDocument();

  const scrollSettings = {
    isFinite: false,
    enableVirtualization: false,
  };

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

  const created = () => {
    const spreadsheet = editorRef.current;
    if (!spreadsheet) return;
    spreadsheet.addFileMenuItems(
      [
        {
          text: "Save",
          iconCss: "e-icons e-cloud",
          id: "save",
        },
      ],
      "Save As", // Position before or after this built-in item
      false
    );
  };

  const onFileMenuItemSelect = (args) => {
    handleFileMenuItemSelect(args, { onSave });
  };

  const beforeSave = (args) => {
    console.log(args)

  };

  return (
    <div style={{ width: "100%", height: "calc(100vh - 64px)" }}>
      <SpreadsheetComponent
        ref={editorRef}
        scrollSettings={scrollSettings}
        allowOpen={true}
        allowSave={true}
        saveUrl="https://document.syncfusion.com/web-services/spreadsheet-editor/api/spreadsheet/save"
        width="100%"
        height="100%"
        created={created}
        beforeSave={beforeSave}
        fileMenuItemSelect={onFileMenuItemSelect}
      />
    </div>
  );
};

export default SpreadSheetEditor;
