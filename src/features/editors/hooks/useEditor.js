import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/api";
import { toast } from "sonner";
import { FILE_EXTENSIONS, MIME_TYPES } from "../constants/documentTypes";
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

      const { file: fileUrl, title: fileName, folder, file_extension } = data;
      const ext = file_extension?.toLowerCase();
      const isDocx = FILE_EXTENSIONS.WORD.includes(ext);
      const isExcel = FILE_EXTENSIONS.EXCEL.includes(ext);

      const file = await processFile(fileUrl, fileName, isDocx, isExcel);

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

  // Handle errors
  useEffect(() => {
    if (query.isError) {
      toast.error("Failed to load document", {
        description: query.error?.message || "Error",
      });
    }
  }, [query.isError, query.error]);

  return query;
};

// Helper Functions
async function processFile(fileUrl, fileName, isDocx, isExcel) {
  if (isDocx) {
    return await fetchWordFile(fileUrl, fileName);
  }

  if (isExcel) {
    return await fetchExcelFile(fileUrl, fileName);
  }

  return fileUrl; // PDFs or non-editable previews
}

async function fetchWordFile(fileUrl, fileName) {
  const blob = await fetch(fileUrl).then((r) => r.blob());
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
export const useSaveDocument = () => {
  return useMutation({
    mutationFn: async ({ editorRef, documentId, fileExtension }) => {
      if (!documentId) {
        throw new Error("No document to save");
      }
      // Check if it's a Word document that needs blob conversion
      const isDocx = FILE_EXTENSIONS.WORD.includes(
        fileExtension?.toLowerCase()
      );

      const isExcel = FILE_EXTENSIONS.EXCEL.includes(
        fileExtension?.toLowerCase()
      );

      let base64Content;
      let fileName;
      if (!editorRef.current) {
        throw new Error("Editor not available");
      }
      if (isDocx) {
        // Word documents: Get content from Syncfusion Document Editor

        // Get the document content as blob
        const blob = await editorRef.current.documentEditor.saveAsBlob("Docx");

        // Convert blob to base64
        base64Content = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result.split(",")[1];
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        fileName = editorRef.current.documentEditor.documentName;
      } else if (isExcel) {
        // For Excel files, they handle their own save mechanism
        editorRef.current.saveAsJson().then((json) => {
          const FormData = new FormData();
          FormData.appent("FileName");
        });
      } else {
        // This will be handled by their respective editors/components
        throw new Error(
          `Saving ${fileExtension} files is handled by their specific editor`
        );
      }

      // Save to backend
      const response = await api.post("/documents/editor/export/", {
        documentId,
        content: base64Content,
        fileName: fileName,
      });

      if (!response.data.success) {
        throw new Error("Save operation failed");
      }

      return response.data;
    },
    onSuccess: () => {
      toast.success("Document saved successfully", {
        richColors: true,
        description: "Your changes have been saved to Cloudinary.",
      });
    },
    onError: (error) => {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.error || error.message || "An error occurred while saving.";
      const errorDescription = errorData?.message || errorMessage;

      toast.error("Failed to save document", {
        richColors: true,
        description: errorDescription,
      });
    },
  });
};
