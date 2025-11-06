import React from "react";
import { SpreadsheetComponent } from "@syncfusion/ej2-react-spreadsheet";

const SpreadSheetEditor = ({ editorRef, documentId }) => {
  let saveInitiated = false;

  const scrollSettings = {
    isFinite: false,
    enableVirtualization: false,
  };

  // Handles the save event
  const beforeSaveHandler = (eventArgs) => {
    if (!saveInitiated) {
      eventArgs.cancel = true; // Prevent default save
      saveInitiated = true;
      saveAsExcel(eventArgs);
    }
  };

const saveAsExcel = async () => {
  const spreadsheet = editorRef.current;
  if (!spreadsheet) return;

  try {
    const json = await spreadsheet.saveAsJson();
    saveInitiated = false;

    const formData = new FormData();
    formData.append("FileName", "Sample");
    formData.append("saveType", "Xlsx");
    formData.append("JSONData", JSON.stringify(json.jsonObject.Workbook));
    formData.append("PdfLayoutSettings", JSON.stringify({ FitSheetOnOnePage: false }));

    // Add Cloudinary file info or document ID
    formData.append("document_id", documentId); // or Cloudinary public_id

    const response = await fetch("http://127.0.0.1:8000/api/documents/spreadsheet/save/", {
      method: "POST",
      body: formData,
    });

    console.log("Save response:", response);
  } catch (error) {
    console.error("Error during save:", error);
    saveInitiated = false;
  }
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
        beforeSave={beforeSaveHandler}
        saveUrl="http://127.0.0.1:8000/api/documents/spreadsheet/save/"
      />
    </div>
  );
};

export default SpreadSheetEditor;
