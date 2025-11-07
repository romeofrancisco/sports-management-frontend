import React from "react";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";
import { useSaveDocument } from "@/features/editors/hooks/useEditor";
import {
  handleSave,
  handleFileMenuItemSelect,
} from "./handlers/spreadsheetEditorHandlers";

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
    });
  };

  const fileMenuBeforeOpen = () => {
    const spreadsheet = editorRef.current;
    if (!spreadsheet) return;

    // Wait for file menu to actually initialize
    spreadsheet.hideFileMenuItems(["Save As"], true);
    spreadsheet.addFileMenuItems(
      [
        {
          text: "Save",
          iconCss: "e-icons e-save",
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

  return (
    <div style={{ width: "100%", height: "calc(100vh - 64px)" }}>
      <SpreadsheetComponent
        ref={editorRef}
        scrollSettings={scrollSettings}
        allowOpen={true}
        allowSave={true}
        width="100%"
        height="100%"
        fileMenuBeforeOpen={fileMenuBeforeOpen}
        fileMenuItemSelect={onFileMenuItemSelect}
      />
    </div>
  );
};

export default SpreadSheetEditor;
