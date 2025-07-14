import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import { useLeaderCategories } from "@/hooks/useLeaderCategories";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { useSportDetails } from "@/hooks/useSports";

const MAX_STATS_PER_CATEGORY = 4;

const LeaderForm = ({ onClose, stats, sportSlug, leaderCategory = null }) => {
  const isEdit = !!leaderCategory;
  const { createLeaderCategory, updateLeaderCategory } = useLeaderCategories();
  const { data: sportData } = useSportDetails(sportSlug);
  const sportId = sportData?.id;

  const leaderStats = stats?.filter((stat) => stat.is_record || stat.formula) || [];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      sport: sportId || null,
      name: leaderCategory?.name || "",
      stat_types: leaderCategory?.stat_types_details?.map((s) => parseInt(s.id, 10)) || [],
      primary_stat_id: leaderCategory?.primary_stat_id ? Number(leaderCategory.primary_stat_id) : null,
    },
  });

  const selectedStats = watch("stat_types") || [];
  const primaryStat = watch("primary_stat_id");

  // Update sport ID when fetched
  useEffect(() => {
    if (sportId) setValue("sport", sportId);
  }, [sportId, setValue]);

  // Keep primary stat synced with selected stats
  useEffect(() => {
    const primaryInSelected = selectedStats.includes(Number(primaryStat));
    if (!primaryInSelected && selectedStats.length > 0) {
      setValue("primary_stat_id", selectedStats[0] || null);
    } else if (selectedStats.length === 0) {
      setValue("primary_stat_id", null);
    }
  }, [selectedStats, primaryStat, setValue]);

  const isStatSelected = (statId) => selectedStats.includes(Number(statId));

  const handleStatSelect = (statId) => {
    clearErrors("stat_types");
    const id = Number(statId);
    const currentStats = selectedStats.map(Number);

    if (currentStats.includes(id)) {
      const updated = currentStats.filter((s) => s !== id);
      setValue("stat_types", updated, { shouldValidate: true });
      if (Number(primaryStat) === id) {
        setValue("primary_stat_id", updated[0] || null);
      }
    } else {
      if (currentStats.length < MAX_STATS_PER_CATEGORY) {
        const updated = [...currentStats, id];
        setValue("stat_types", updated, { shouldValidate: true });
        if (updated.length === 1) {
          setValue("primary_stat_id", id);
        }
      } else {
        toast.error(`Maximum ${MAX_STATS_PER_CATEGORY} stats allowed per category`);
      }
    }
  };

  const getStatById = (id) => stats?.find((s) => Number(s.id) === Number(id));

  const onSubmit = async (data) => {
    if (data.stat_types.length === 0) {
      setError("stat_types", { type: "manual", message: "At least one stat must be selected" });
      return;
    }

    if (data.primary_stat_id && !data.stat_types.includes(Number(data.primary_stat_id))) {
      setError("primary_stat_id", { type: "manual", message: "Primary stat must be selected" });
      return;
    }

    // Create a copy of the data for submission
    const submissionData = {
      ...data,
      primary_stat: data.primary_stat_id // Ensure we're using the expected field name for the API
    };
    
    try {
      if (isEdit) {
        await updateLeaderCategory.mutateAsync({ id: leaderCategory.id, data: submissionData });
        toast.success("Leader category updated");
      } else {
        await createLeaderCategory.mutateAsync(submissionData);
        toast.success("Leader category created");
      }
      onClose();
    } catch (error) {
      const apiErrors = error.response?.data;
      if (apiErrors) {
        Object.entries(apiErrors).forEach(([field, message]) => {
          setError(field, {
            type: "manual",
            message: Array.isArray(message) ? message.join(", ") : message,
          });
        });
        toast.error("Please correct the errors");
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
        placeholder="e.g., Top Scorers"
        rules={{ required: "Category name is required" }}
        errors={errors}
      />

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Stats ({selectedStats.length}/{MAX_STATS_PER_CATEGORY})</Label>
          {errors.stat_types && <p className="text-sm text-destructive">{errors.stat_types.message}</p>}
        </div>

        <Tabs defaultValue="recording" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="recording">Recording Stats</TabsTrigger>
            <TabsTrigger value="calculated">Calculated Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="recording">
            <div className="grid grid-cols-2 gap-2">
              {leaderStats.filter((s) => s.is_record).map((stat) => (
                <Badge
                  key={stat.id}
                  variant={isStatSelected(stat.id) ? "default" : "outline"}
                  className={`cursor-pointer py-1.5 px-3 ${isStatSelected(stat.id) ? "bg-primary" : "hover:bg-primary/10"}`}
                  onClick={() => handleStatSelect(stat.id)}
                >
                  {stat.name}
                </Badge>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calculated">
            <div className="grid grid-cols-2 gap-2">
              {leaderStats.filter((s) => !s.is_record && s.formula).map((stat) => (
                <Badge
                  key={stat.id}
                  variant={isStatSelected(stat.id) ? "default" : "outline"}
                  className={`cursor-pointer py-1.5 px-3 ${isStatSelected(stat.id) ? "bg-primary" : "hover:bg-primary/10"}`}
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
              {selectedStats.map((id) => {
                const stat = getStatById(id);
                return (
                  <Badge
                    key={id}
                    variant={Number(primaryStat) === Number(id) ? "default" : "secondary"}
                    className={`flex gap-1 items-center ${Number(primaryStat) === Number(id) ? "bg-primary" : ""}`}
                  >
                    {stat?.name || "Unknown"}
                    <button type="button" className="ml-1 rounded-full hover:bg-destructive/20 p-0.5" onClick={() => handleStatSelect(id)}>✕</button>
                  </Badge>
                );
              })}
            </div>

            {selectedStats.length > 1 && (
              <div className="mt-4">
                <ControlledSelect
                  name="primary_stat_id"
                  control={control}
                  label="Primary Stat (for ordering)"
                  help_text="This stat will be used to rank players"
                  placeholder="Select primary stat"
                  options={selectedStats.map((id) => {
                    const stat = getStatById(id);
                    return { value: Number(id), label: stat?.name || "Unknown" };
                  })}
                  errors={errors}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEdit ? "Updating..." : "Creating..."}
          </>
        ) : isEdit ? "Update Leader Category" : "Create Leader Category"}
      </Button>
    </form>
  );
};

export default LeaderForm;
