import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import api from "@/api";
import { toast } from "sonner";

/**
 * Hook to fetch and load a document for editing
 * Handles file download and File object creation
 */
export const useLoadDocument = (documentId, editorRef, isEditorReady) => {
  const query = useQuery({
    queryKey: ["document-editor", documentId],
    queryFn: async () => {
      // Get document metadata and permissions
      const response = await api.get(`/documents/files/${documentId}/`);
      
      if (!response.data) {
        throw new Error("Document not found");
      }

      const { file: fileUrl, title: fileName, folder } = response.data;

      // Download the file as blob
      const fileResponse = await fetch(fileUrl);
      const blob = await fileResponse.blob();

      // Create a File object for Syncfusion
      const file = new File([blob], fileName, {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // Determine if document is in public folder
      const isPublic = folder?.folder_type === "public";

      return {
        file,
        fileName,
        documentId: response.data.id,
        canEdit: response.data.can_edit || false,
        isPublic,
      };
    },
    enabled: !!documentId && !!editorRef.current && isEditorReady,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });

  // Handle document opening when data is available
  useEffect(() => {
    if (query.isSuccess && query.data && editorRef.current) {
      try {
        editorRef.current.documentEditor.open(query.data.file);
        
        // Set document name
        editorRef.current.documentEditor.documentName = query.data.fileName.replace(
          /\.[^/.]+$/,
          ""
        );
        
        toast.success(`Document "${query.data.fileName}" loaded successfully`, {
          richColors: true,
        });
      } catch (err) {
        console.error("Error opening document:", err);
        toast.error("Failed to open document in editor");
      }
    }
  }, [query.isSuccess, query.data, editorRef]);

  // Handle errors
  useEffect(() => {
    if (query.isError) {
      toast.error("Failed to load document", {
        richColors: true,
        description: query.error?.response?.data?.error || query.error?.message || "An error occurred",
      });
    }
  }, [query.isError, query.error]);

  return query;
};

/**
 * Hook to save document back to Cloudinary
 * Handles blob to base64 conversion automatically
 */
export const useSaveDocument = () => {
  return useMutation({
    mutationFn: async ({ editorRef, documentId }) => {
      if (!editorRef.current || !documentId) {
        throw new Error("No document to save");
      }

      // Get the document content as blob
      const blob = await editorRef.current.documentEditor.saveAsBlob("Docx");
      
      // Convert blob to base64
      const base64Content = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result.split(",")[1];
          resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Save to backend
      const response = await api.post("/documents/editor/export/", {
        documentId,
        content: base64Content,
        fileName: editorRef.current.documentEditor.documentName,
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
      const errorMessage = errorData?.error || error.message || "An error occurred while saving.";
      const errorDescription = errorData?.message || errorMessage;
      
      toast.error("Failed to save document", {
        richColors: true,
        description: errorDescription,
      });
    },
  });
};
