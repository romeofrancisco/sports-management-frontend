import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import { toast } from "sonner";
import { useSportDetails } from "@/hooks/useSports";
import { useCreateposition, useUpdateposition } from "@/hooks/useSports";

const PositionForm = ({ onClose, sportSlug, position = null }) => {
  const isEdit = !!position;
  const createPosition = useCreateposition();
  const updatePosition = useUpdateposition();
  
  // Fetch the sport data to get its ID
  const { data: sportData } = useSportDetails(sportSlug);
  const sportId = sportData?.id;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      sport: sportSlug,
      name: position?.name || "",
      abbreviation: position?.abbreviation || "",
    },
  });

  // Update the sport when sportData changes
  React.useEffect(() => {
    if (sportId) {
      setValue("sport", sportSlug);
    }
  }, [sportId, setValue, sportSlug]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updatePosition.mutateAsync({
          id: position.id,
          data
        });
        toast.success("Position updated successfully");
      } else {
        await createPosition.mutateAsync(data);
        toast.success("Position created successfully");
      }
      onClose();
    } catch (error) {
      // Handle API validation errors
      const apiErrors = error.response?.data;
      if (apiErrors) {
        // Map API errors to form fields
        console.log(apiErrors)
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
        label="Position Name"
        control={control}
        placeholder="e.g., Point Guard, Center, Goalkeeper"
        rules={{ required: "Position name is required" }}
        errors={errors}
      />

      <ControlledInput
        name="abbreviation"
        label="Abbreviation"
        control={control}
        placeholder="e.g., PG, C, GK"
        help_text="Short code to display in lineups and stats"
        errors={errors}
      />

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
          isEdit ? "Update Position" : "Create Position"
        )}
      </Button>
    </form>
  );
};

export default PositionForm;