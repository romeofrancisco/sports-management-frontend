import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import { useCreateSport, useUpdateSport } from "@/hooks/useSports";
import { toast } from "sonner";
import ImageUpload from "../common/ImageUpload";
import { Label } from "../ui/label";

const SportForm = ({ onClose, sport = null }) => {
  const isEdit = !!sport;
  const createSport = useCreateSport();
  const updateSport = useUpdateSport();
  const [bannerPreview, setBannerPreview] = useState(sport?.banner || null);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: sport?.name || "",
      scoring_type: sport?.scoring_type || "points",
      banner: null,
    },
  });

  const scoringTypeOptions = [
    { id: "points", name: "Points-based (e.g., Basketball, Football)" },
    { id: "sets", name: "Sets-based (e.g., Volleyball, Tennis)" },
  ];

  const handleImageChange = (file) => {
    if (file) {
      setValue("banner", file);
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("scoring_type", data.scoring_type);
      
      if (data.banner) {
        formData.append("banner", data.banner);
      }

      if (isEdit) {
        await updateSport.mutateAsync({
          id: sport.id,
          data: formData
        });
        toast.success(`${data.name} updated successfully`);
      } else {
        await createSport.mutateAsync(formData);
        toast.success(`${data.name} created successfully`);
      }
      onClose();
    } catch (error) {
      // Handle API validation errors
      const apiErrors = error.response?.data;
      if (apiErrors) {
        // Map API errors to form fields
        Object.keys(apiErrors).forEach(field => {
          const message = Array.isArray(apiErrors[field])
            ? apiErrors[field].join(", ")
            : apiErrors[field];
            
          setError(field, {
            type: "manual",
            message: message,
          });
        });
        
        toast.error("Please correct the errors in the form");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1">
      <ControlledInput
        name="name"
        label="Sport Name"
        control={control}
        placeholder="e.g., Basketball, Football, Tennis"
        rules={{ required: "Sport name is required" }}
        errors={errors}
      />

      <ControlledSelect
        name="scoring_type"
        control={control}
        label="Scoring Type"
        help_text="How points are counted in this sport"
        placeholder="Select scoring type"
        options={scoringTypeOptions}
        valueKey="id"
        labelKey="name"
        errors={errors}
      />

      <div className="space-y-2">
        <Label>Sport Banner Image</Label>
        <ImageUpload
          onImageChange={handleImageChange}
          previewUrl={bannerPreview}
          existingImageUrl={sport?.banner}
          aspectRatio="16:9"
          className="w-full h-40"
          help_text="Upload a banner image for this sport (optional)"
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-6"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEdit ? "Updating..." : "Creating..."}
          </>
        ) : (
          isEdit ? "Update Sport" : "Create Sport"
        )}
      </Button>
    </form>
  );
};

export default SportForm;
