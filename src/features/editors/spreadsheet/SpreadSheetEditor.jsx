import React from "react";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";

const SpreadSheetEditor = ({ editorRef }) => {
  const scrollSettings = {
    isFinite: false,
    enableVirtualization: false,
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
      />
    </div>
  );
};

export default SpreadSheetEditor;
