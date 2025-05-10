import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import { useLeaderCategories } from "@/hooks/useLeaderCategories";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useSportDetails } from "@/hooks/useSports"; // Changed from useSport to useSportDetails

const MAX_STATS_PER_CATEGORY = 4;

const LeaderForm = ({ onClose, stats, sportSlug, leaderCategory = null }) => {
  const isEdit = !!leaderCategory;
  const { createLeaderCategory, updateLeaderCategory } = useLeaderCategories();
  
  // Fetch the sport data to get its ID
  const { data: sportData } = useSportDetails(sportSlug);
  const sportId = sportData?.id;

  // Filter to only stats that make sense as leaders (points, rebounds, etc.)
  const leaderStats = stats?.filter(
    (stat) => stat.is_record || stat.formula
  ) || [];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      sport: sportId, // Use the actual sport ID instead of slug
      name: leaderCategory?.name || "",
      display_order: leaderCategory?.display_order || 0,
      stat_types: leaderCategory?.stat_types?.map(stat => stat.id) || [],
    },
  });

  // Update the sport ID when sportData changes
  React.useEffect(() => {
    if (sportId) {
      setValue("sport", sportId);
    }
  }, [sportId, setValue]);

  const selectedStats = watch("stat_types") || [];
  
  const handleStatSelect = (statId) => {
    // Clear any existing stat_types errors when user tries to select stats
    if (errors.stat_types) {
      clearErrors("stat_types");
    }
    
    const currentStats = [...selectedStats];
    
    // Check if already selected (remove) or not (add)
    const statIndex = currentStats.findIndex(id => id === statId);
    
    if (statIndex >= 0) {
      // Remove stat
      currentStats.splice(statIndex, 1);
      setValue("stat_types", currentStats, { shouldValidate: true });
    } else {
      // Add stat if under the limit
      if (currentStats.length < MAX_STATS_PER_CATEGORY) {
        currentStats.push(statId);
        setValue("stat_types", currentStats, { shouldValidate: true });
      } else {
        // Show toast for better UX
        toast.error(`Maximum ${MAX_STATS_PER_CATEGORY} stats allowed per category`);
      }
    }
  };
  
  const getStatById = (id) => {
    return stats?.find((stat) => stat.id === id);
  };

  const onSubmit = async (data) => {
    try {
      // Validate at least one stat is selected
      if (data.stat_types.length === 0) {
        setError("stat_types", {
          type: "manual",
          message: "At least one stat must be selected",
        });
        return;
      }

      if (isEdit) {
        await updateLeaderCategory.mutateAsync({
          id: leaderCategory.id,
          data
        });
        toast.success("Leader category updated successfully");
      } else {
        await createLeaderCategory.mutateAsync(data);
        toast.success("Leader category created successfully");
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
        
        // Show a general error message
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
        label="Category Name"
        control={control}
        placeholder="e.g., Top Scorers, Rebounding Leaders"
        rules={{ required: "Category name is required" }}
        errors={errors}
      />

      <ControlledInput
        name="display_order"
        label="Display Order"
        control={control}
        type="number"
        min={0}
        help_text="Lower numbers appear first in the UI"
        errors={errors}
      />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Stats ({selectedStats.length}/{MAX_STATS_PER_CATEGORY})</Label>
          {errors.stat_types && (
            <p className="text-sm text-destructive">{errors.stat_types.message}</p>
          )}
        </div>
        
        <Tabs defaultValue="recording" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="recording">Recording Stats</TabsTrigger>
            <TabsTrigger value="calculated">Calculated Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recording" className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              {leaderStats
                .filter(stat => stat.is_record)
                .map((stat) => (
                  <Badge
                    key={stat.id}
                    variant={selectedStats.includes(stat.id) ? "default" : "outline"}
                    className={`cursor-pointer py-1.5 px-3 ${
                      selectedStats.includes(stat.id) ? "bg-primary" : "hover:bg-primary/10"
                    }`}
                    onClick={() => handleStatSelect(stat.id)}
                  >
                    {stat.name}
                  </Badge>
                ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calculated" className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              {leaderStats
                .filter(stat => !stat.is_record && stat.formula)
                .map((stat) => (
                  <Badge
                    key={stat.id}
                    variant={selectedStats.includes(stat.id) ? "default" : "outline"}
                    className={`cursor-pointer py-1.5 px-3 ${
                      selectedStats.includes(stat.id) ? "bg-primary" : "hover:bg-primary/10"
                    }`}
                    onClick={() => handleStatSelect(stat.id)}
                  >
                    {stat.name}
                  </Badge>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {selectedStats.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-md">
            <h4 className="text-sm font-medium mb-2">Selected Stats:</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedStats.map((statId) => {
                const stat = getStatById(statId);
                return (
                  <Badge key={statId} variant="secondary" className="flex gap-1 items-center">
                    {stat?.name || "Unknown Stat"}
                    <button
                      type="button"
                      className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                      onClick={() => handleStatSelect(statId)}
                    >
                      ✕
                    </button>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
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
          isEdit ? "Update Leader Category" : "Create Leader Category"
        )}
      </Button>
    </form>
  );
};

export default LeaderForm;