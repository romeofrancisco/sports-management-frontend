import React, { useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { Button } from "@/components/ui/button";
import api from "@/api";
import { queryClient } from "@/context/QueryProvider";
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

  const handleSave = async (values) => {
    try {
      // Build FormData so image file uploads are handled correctly.
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("location", values.location || "");
      formData.append("capacity", values.capacity ?? 0);
      formData.append("description", values.description || "");
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      if (selectedFacility) {
        await api.put(`facilities/${selectedFacility.id}/`, formData);
        toast.success("Facility updated", {
          richColors: true,
          description: "The facility has been successfully updated.",
        });
      } else {
        await api.post(`facilities/`, formData);
        toast.success("Facility created", {
          richColors: true,
          description: "The facility has been successfully created.",
        });
      }
      queryClient.invalidateQueries(["facilities"]);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save facility");
    }
  };

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
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {selectedFacility ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FacilityFormModal;
