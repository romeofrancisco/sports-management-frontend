import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/api";
import { toast } from "sonner";
import { FILE_EXTENSIONS, MIME_TYPES } from "../constants/fileTypes";
/**
 * Hook to fetch and load a document for editing
 * Handles file download and File object creation
 */
export const useLoadDocument = (documentId, editorRef) => {
  const query = useQuery({
    queryKey: ["document-editor", documentId],
    queryFn: async () => {
      const { data } = await api.get(`/documents/files/${documentId}/`);
      if (!data) throw new Error("Document not found");

      const { file: fileUrl, title: fileName, folder, file_extension, version } = data;
      const ext = file_extension?.toLowerCase();
      const isDocx = FILE_EXTENSIONS.WORD.includes(ext);
      const isExcel = FILE_EXTENSIONS.EXCEL.includes(ext);

      const file = await processFile(fileUrl, fileName, version, isDocx, isExcel);

      return {
        file,
        fileName,
        documentId: data.id,
        canEdit: data.can_edit || false,
        isPublic: folder?.folder_type === "public",
        isDocx,
        isExcel,
        fileExtension: file_extension,
      };
    },
    enabled: !!documentId,
  });

  // Load document into editor when ready
  useEffect(() => {
    if (!query.isSuccess || !query.data || !editorRef.current) return;

    const { isDocx, isExcel, file, fileName, fileExtension } = query.data;

    try {
      if (isDocx) {
        loadWordDocument(editorRef.current, file, fileName);
      } else if (isExcel) {
        loadExcelDocument(editorRef.current, file, fileName);
      } else {
        toast.info(`Loaded ${fileExtension?.toUpperCase()}`);
      }
    } catch (err) {
      console.error("Error opening document:", err);
      toast.error("Failed to open document");
    }
  }, [query.isSuccess, query.data, editorRef]);
  return query;
};

// Helper Functions
async function processFile(fileUrl, fileName, version, isDocx, isExcel) {
  if (isDocx) {
    return await fetchWordFile(fileUrl, fileName, version);
  }

  if (isExcel) {
    return await fetchExcelFile(fileUrl, fileName);
  }

  return fileUrl; // PDFs or non-editable previews
}

async function fetchWordFile(fileUrl, fileName, version) {
  // prevent browser cache
  const fileUrlWithVersion = `${fileUrl}?v=${version}`;
  const blob = await fetch(fileUrlWithVersion, { cache: "no-store" }).then((r) => r.blob());
  return new File([blob], fileName, { type: MIME_TYPES.DOCX });
}


async function fetchExcelFile(fileUrl, fileName) {
  const blob = await fetch(fileUrl).then((r) => r.blob());
  const formData = new FormData();
  formData.append("file", blob, fileName);

  const response = await fetch(
    "http://localhost:8000/api/documents/spreadsheet/open/",
    {
      method: "POST",
      body: formData,
      credentials: "include",
    }
  );

  if (response.ok) {
    toast.success(`Spreadsheet loaded`, {
      description: fileName,
      richColors: true,
    });
  } else {
    throw new Error("Failed to open Excel file");
  }

  return await response.json();
}

function loadWordDocument(editor, file, fileName) {
  editor.documentEditor.open(file);
  editor.documentEditor.documentName = fileName.replace(/\.[^/.]+$/, "");
  toast.success(`Document loaded`, { description: fileName, richColors: true });
}

function loadExcelDocument(editor, file) {
  if (editor.openFromJson) {
    editor.openFromJson({ file });
  }
}

/**
 * Hook to save document back to Cloudinary
 * Handles different file types appropriately:
 * - Word documents: Converts blob to base64 from Syncfusion editor
 * - Other files (PDF, spreadsheets, etc.): Handles them directly
 */
// Convert Blob → base64
export const useSaveDocument = () => {
  return useMutation({
    mutationFn: async ({ editorRef, documentId, fileExtension }) => {
      if (!documentId) throw new Error("No document to save");
      if (!editorRef?.current) throw new Error("Editor not available");

      const ext = fileExtension?.toLowerCase();
      const isDocx = FILE_EXTENSIONS.WORD.includes(ext);
      const isExcel = FILE_EXTENSIONS.EXCEL.includes(ext);

      let base64Content;
      let fileName;

      // ---------- WORD ----------
      if (isDocx) {
        const blob = await editorRef.current.documentEditor.saveAsBlob("Docx");
        base64Content = (await blobToBase64(blob)).split(",")[1];
        fileName =
          editorRef.current.documentEditor?.documentName || "Document.docx";

        const response = await api.post("/documents/editor/export/", {
          documentId,
          content: base64Content,
          fileName,
        });

        if (!response.data.success) throw new Error("Save operation failed");
        return response.data;
      }

      // ---------- EXCEL ----------
      else if (isExcel) {
        const spreadsheet = editorRef.current;
        if (!spreadsheet) throw new Error("Spreadsheet not initialized");

        // 1️⃣ Get JSON data from Syncfusion
        const jsonData = await spreadsheet.saveAsJson();

        // 2️⃣ Send to our backend (axios keeps cookies & interceptors)
        const { data } = await api.post(
          "/documents/spreadsheet/save/",
          {
            documentId,
            FileName: spreadsheet.sheets?.[0]?.name || "Spreadsheet.xlsx",
            JSONData: JSON.stringify(jsonData.jsonObject.Workbook),
            saveType: "Xlsx",
          }
        );

        if (!data?.success) throw new Error("Spreadsheet save failed");
        return data;
      }

      // ---------- UNSUPPORTED ----------
      else {
        throw new Error(
          `Saving ${fileExtension} files is handled by their specific editor`
        );
      }
    },

    // ---------- SUCCESS ----------
    onSuccess: (data) => {
      toast.success("Document saved successfully", {
        richColors: true,
        description: "Your changes have been saved to Cloudinary.",
      });
    },

    // ---------- ERROR ----------
    onError: (error) => {
      const msg =
        error.response?.data?.error || error.message || "Save failed";
      toast.error("Failed to save document", {
        richColors: true,
        description: msg,
      });
    },
  });
};

// --- Helper: Convert Blob → Base64 ---
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
