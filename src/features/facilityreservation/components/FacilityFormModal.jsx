import React, { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import api from "@/api";
import { queryClient } from "@/context/QueryProvider";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import ControlledInput from "@/components/common/ControlledInput";
import ControlledTextarea from "@/components/common/ControlledTextarea";
import { useForm } from "react-hook-form";

const FacilityFormModal = ({ open, onOpenChange, selectedFacility }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
      capacity: 0,
      description: "",
      image: null,
    },
  });

  useEffect(() => {
    if (open) {
      if (selectedFacility) {
        reset({
          name: selectedFacility.name || "",
          location: selectedFacility.location || "",
          capacity: selectedFacility.capacity || 0,
          description: selectedFacility.description || "",
          // file inputs cannot be prefilled with a URL, keep null
          image: null,
        });
      } else {
        reset({
          name: "",
          location: "",
          capacity: 0,
          description: "",
          image: null,
        });
      }
    }
  }, [open, selectedFacility, reset]);
  // Mutations for create/update using TanStack Query
  const createMutation = useMutation({
    mutationFn: (formData) => api.post(`facilities/`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["facilities"]);
      toast.success("Facility created", {
        richColors: true,
        description: "The facility has been successfully created.",
      });
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to create facility");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => api.put(`facilities/${id}/`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["facilities"]);
      toast.success("Facility updated", {
        richColors: true,
        description: "The facility has been successfully updated.",
      });
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update facility");
    },
  });

  const handleSave = async (values) => {
    // Build FormData so image file uploads are handled correctly.
    const formData = new FormData();
    formData.append("name", values.name || "");
    formData.append("location", values.location || "");
    formData.append("capacity", values.capacity ?? 0);
    formData.append("description", values.description || "");
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0]);
    }

    try {
      if (selectedFacility) {
        await updateMutation.mutateAsync({ id: selectedFacility.id, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (err) {
      // Errors handled in onError of mutations
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      icon={Building2}
      open={open}
      onOpenChange={onOpenChange}
      title={selectedFacility ? "Edit Facility" : "Add Facility"}
      description={
        selectedFacility
          ? "Edit the details of the facility."
          : "Add a new facility with its details."
      }
    >
      <form onSubmit={handleSubmit(handleSave)} className="grid gap-4 px-1">
        <ControlledInput
          name="name"
          control={control}
          label="Name"
          placeholder="Facility name"
          errors={errors}
        />

        <ControlledInput
          name="location"
          control={control}
          label="Location"
          placeholder="Building / Room"
          errors={errors}
        />

        <ControlledInput
          name="capacity"
          control={control}
          label="Capacity"
          type="number"
          placeholder="0"
          errors={errors}
        />

        <ControlledTextarea
          name="description"
          control={control}
          label="Description"
          placeholder="Short description"
          errors={errors}
        />

        <ControlledInput
          name="image"
          control={control}
          label="Image"
          type="file"
          accept="image/*"
          errors={errors}
        />

        <div className="flex justify-end gap-2 mt-2">
          <Button type="submit" disabled={isMutating || isSubmitting}>
            {isMutating
              ? selectedFacility
                ? "Updating Facility..."
                : "Creating Facility..."
              : selectedFacility
              ? "Update Facility"
              : "Create Facility"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FacilityFormModal;
