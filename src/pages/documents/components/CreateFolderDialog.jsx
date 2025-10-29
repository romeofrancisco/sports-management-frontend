import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRolePermissions } from "@/hooks/useRolePermissions";
import Modal from "@/components/common/Modal";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledTextarea from "@/components/common/ControlledTextarea";
import ControlledSelect from "@/components/common/ControlledSelect";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CreateFolderDialog = ({ open, onOpenChange, onCreateFolder, isCreating, currentFolder }) => {
  const { isAdmin, isCoach } = useRolePermissions();
  
  const {
    control,
    handleSubmit,
    reset,
    watch,
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
    try {
      const folderData = {
        name: data.name.trim(),
        description: data.description?.trim() || "",
      };

      // Include folder_type only if at root and type is selected
      if (showFolderTypeSelect && data.folder_type) {
        folderData.folder_type = data.folder_type;
      }

      await onCreateFolder(folderData);

      // Reset form and close
      reset();
      onOpenChange(false);
    } catch (err) {
      // Error handled by parent component
    }
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
              message: "Folder name must be at least 2 characters"
            },
            maxLength: {
              value: 100,
              message: "Folder name must not exceed 100 characters"
            }
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
                <FolderPlus className="mr-2 h-4 w-4 animate-pulse" />
                Creating...
              </>
            ) : (
              <>
                <FolderPlus className="mr-2 h-4 w-4" />
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
