import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { useCreateFolder } from "@/hooks/useDocuments";
import Modal from "@/components/common/Modal";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledTextarea from "@/components/common/ControlledTextarea";
import ControlledSelect from "@/components/common/ControlledSelect";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CreateFolderDialog = ({
  open,
  onOpenChange,
  currentFolder,
  rootData,
}) => {
  const { isAdmin, isCoach } = useRolePermissions();
  const { mutate: createFolder, isPending: isCreating } = useCreateFolder();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      folder_type: "",
    },
  });

  // Watch if we're at root (currentFolder is null)
  const isAtRoot = !currentFolder;

  // Get available folder type options based on user role
  const getFolderTypeOptions = () => {
    if (!isAtRoot) {
      // Not at root - folder type is automatically determined by parent
      return [];
    }

    if (isAdmin()) {
      return [
        { value: "public", label: "Public Folder" },
        { value: "coaches", label: "Coaches Folder" },
        { value: "admin_private", label: "Admin Private Folder" },
      ];
    }

    if (isCoach()) {
      return [
        { value: "coach_personal", label: "Personal Folder" },
        { value: "players", label: "Players Folder" },
      ];
    }

    return [];
  };

  const folderTypeOptions = getFolderTypeOptions();
  const showFolderTypeSelect = isAtRoot && folderTypeOptions.length > 0;

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data) => {
    // Use personal_folder_id from rootData if at root (for coaches/players)
    const parentFolderId =
      currentFolder?.id || rootData?.personal_folder_id || null;

    const folderData = {
      name: data.name.trim(),
      description: data.description?.trim() || "",
      parent: parentFolderId,
    };

    // Include folder_type only if at root and type is selected
    if (showFolderTypeSelect && data.folder_type) {
      folderData.folder_type = data.folder_type;
    }

    createFolder(folderData, {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      },
      onError: (e) => {        
        const error = e.response?.data;
        
        // If response is HTML (server error), show a generic message
        if (typeof error === 'string' && error.includes('<!DOCTYPE')) {
          setError('name', {
            type: 'server',
            message: 'This folder name already exists.',
          });
          return;
        }
        
        if (error) {
          
          // Check if error is a string (non-field error)
          if (typeof error === 'string') {
            setError('name', {
              type: 'server',
              message: error,
            });
            return;
          }
          
          // Check for non_field_errors
          if (error.non_field_errors) {
            const errorMessage = Array.isArray(error.non_field_errors)
              ? error.non_field_errors[0]
              : error.non_field_errors;
            setError('name', {
              type: 'server',
              message: errorMessage,
            });
            return;
          }
          
          // Handle field-specific errors
          Object.keys(error).forEach((fieldName) => {
            // Skip if the key looks like it's part of a split string (numeric keys)
            if (!isNaN(fieldName)) {
              return;
            }
            
            // Handle both string and array error formats
            let errorMessage = error[fieldName];
            if (Array.isArray(errorMessage)) {
              errorMessage = errorMessage[0]; // Take the first error message
            }
            
            console.log(`Setting error for ${fieldName}:`, errorMessage);
            setError(fieldName, {
              type: "server",
              message: errorMessage,
            });
          });
        } else {
          // Fallback error message
          setError('name', {
            type: 'server',
            message: 'Failed to create folder. Please try again.',
          });
        }
      },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Folder"
      description="Create a new folder in the current location"
      icon={FolderPlus}
      size="md"
      scrollable={false}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {/* Folder Type Select (only shown at root for admin/coach) */}
        {showFolderTypeSelect && (
          <ControlledSelect
            name="folder_type"
            control={control}
            label="Folder Type"
            placeholder="Select folder type"
            options={folderTypeOptions}
            errors={errors}
            rules={{ required: "Folder type is required" }}
            disabled={isCreating}
          />
        )}

        {/* Folder Name Input */}
        <ControlledInput
          name="name"
          control={control}
          label="Folder Name"
          placeholder="Enter folder name"
          errors={errors}
          rules={{
            required: "Folder name is required",
            minLength: {
              value: 2,
              message: "Folder name must be at least 2 characters",
            },
            maxLength: {
              value: 100,
              message: "Folder name must not exceed 100 characters",
            },
          }}
          disabled={isCreating}
        />

        {/* Description Textarea */}
        <ControlledTextarea
          name="description"
          control={control}
          label="Description"
          placeholder="Enter folder description (optional)"
          rows={3}
          errors={errors}
          disabled={isCreating}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? (
              <>
                <FolderPlus className="animate-pulse" />
                Creating...
              </>
            ) : (
              <>
                <FolderPlus />
                Create Folder
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateFolderDialog;
