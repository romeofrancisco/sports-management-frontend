import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Loader2, Info, Users, Clock, Target, Settings2 } from "lucide-react";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import ControlledCheckbox from "../common/ControlledCheckbox";
import { useCreateSport, useUpdateSport } from "@/hooks/useSports";
import { toast } from "sonner";
import ImageUpload from "../common/ImageUpload";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";

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
      requires_stats: sport?.requires_stats || false,
      banner: null,
      max_players_per_team: sport?.max_players_per_team || 12,
      max_players_on_field: sport?.max_players_on_field || 5,
      has_period: sport?.has_period || false,
      max_period: sport?.max_period || null,
      has_tie: sport?.has_tie || false,
      has_overtime: sport?.has_overtime || false,
      win_threshold: sport?.win_threshold || null,
      win_points_threshold: sport?.win_points_threshold || null,
      win_margin: sport?.win_margin || null,
    },
  });

  // Watch scoring type to conditionally show/hide fields
  const scoringType = watch("scoring_type");
  const hasPeriod = watch("has_period");
  const hasTie = watch("has_tie");

  // Effect to handle conditional field logic based on scoring type
  useEffect(() => {
    if (scoringType === "sets") {
      // For sets-based sports (volleyball, tennis)
      setValue("has_tie", false); // Sets-based sports typically don't have ties
      setValue("has_overtime", false); // Sets use deuce/advantage instead
      setValue("max_period", null); // Sets don't use periods
      setValue("has_period", true);
    } else if (scoringType === "points") {
      // For points-based sports (basketball, football)
      // Keep user selections but provide reasonable defaults
      if (!sport) {
        // Only set defaults for new sports
        setValue("has_period", true);
        setValue("max_period", 4); // Default for basketball/football
      }
    }
  }, [scoringType, setValue, sport]);

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
      formData.append("requires_stats", data.requires_stats);
      formData.append("max_players_per_team", data.max_players_per_team);
      formData.append("max_players_on_field", data.max_players_on_field);
      formData.append("has_period", data.has_period);
      formData.append("has_tie", data.has_tie);
      formData.append("has_overtime", data.has_overtime);

      // Only append numeric fields if they have values
      if (data.max_period) {
        formData.append("max_period", data.max_period);
      }
      if (data.win_threshold) {
        formData.append("win_threshold", data.win_threshold);
      }
      if (data.win_points_threshold) {
        formData.append("win_points_threshold", data.win_points_threshold);
      }
      if (data.win_margin) {
        formData.append("win_margin", data.win_margin);
      }

      if (data.banner) {
        formData.append("banner", data.banner);
      }
      if (isEdit) {
        await updateSport.mutateAsync({
          id: sport.slug,
          data: formData,
        });
      } else {
        await createSport.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      // Handle API validation errors
      const apiErrors = error.response?.data;
      if (apiErrors) {
        // Map API errors to form fields
        Object.keys(apiErrors).forEach((field) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-1">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            Basic Information
          </h3>
        </div>

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
          disabled={isEdit}
        />

        {scoringType && (
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {scoringType === "points"
                ? "Points-based sports like Basketball track cumulative scores throughout the game."
                : "Sets-based sports like Volleyball use best-of-sets format with specific winning conditions."}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <ControlledCheckbox
        name="requires_stats"
        control={control}
        label="Requires Player Statistics"
        help_text="Enable if this sport tracks individual player statistics"
        errors={errors}
      />

      <Separator className="bg-border/50" />

      {/* Team Configuration Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            Team Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ControlledInput
            name="max_players_per_team"
            label="Max Players Per Team"
            control={control}
            type="number"
            placeholder="12"
            help_text="Maximum players allowed per team roster"
            rules={{
              required: "This field is required",
              min: { value: 1, message: "Must be at least 1" },
              max: { value: 50, message: "Must be 50 or less" },
            }}
            errors={errors}
          />

          <ControlledInput
            name="max_players_on_field"
            label="Max Players On Field"
            control={control}
            type="number"
            placeholder="5"
            help_text="Maximum players allowed on the field/court during play"
            rules={{
              required: "This field is required",
              min: { value: 1, message: "Must be at least 1" },
              max: { value: 25, message: "Must be 25 or less" },
            }}
            errors={errors}
          />
        </div>
      </div>

      {/* Game Structure Section - Only for points-based sports */}
      {scoringType !== "sets" && (
        <>
          <Separator className="bg-border/50" />
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold text-primary">
                Game Structure
              </h3>
            </div>

            <div className="space-y-4">
              <ControlledCheckbox
                name="has_period"
                control={control}
                label="Has Periods/Quarters"
                help_text="Enable if sport is divided into periods/quarters"
                errors={errors}
              />

              {hasPeriod && (
                <div className="ml-6 space-y-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                  <ControlledInput
                    name="max_period"
                    label="Maximum Periods"
                    control={control}
                    type="number"
                    help_text="Maximum periods/quarters possible in a game"
                    rules={{
                      min: { value: 1, message: "Must be at least 1" },
                      max: { value: 10, message: "Must be 10 or less" },
                    }}
                    errors={errors}
                  />

                  <ControlledCheckbox
                    name="has_overtime"
                    control={control}
                    label="Has Overtime"
                    help_text={
                      hasTie
                        ? "Overtime available when tie is allowed"
                        : "Enable overtime periods for tie-breaking"
                    }
                    errors={errors}
                  />
                </div>
              )}

              <ControlledCheckbox
                name="has_tie"
                control={control}
                label="Allow Ties"
                help_text="Enable if games can end in a tie"
                errors={errors}
              />
            </div>
          </div>
        </>
      )}

      {/* Set-Based Winning Conditions - Only for sets-based sports */}
      {scoringType === "sets" && (
        <>
          <Separator className="bg-border/50" />
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-semibold text-primary">
                Set-Based Winning Conditions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ControlledInput
                name="win_threshold"
                label="Sets to Win"
                control={control}
                type="number"
                placeholder="3"
                help_text="Number of sets needed to win the match"
                rules={{
                  min: { value: 1, message: "Must be at least 1" },
                  max: { value: 7, message: "Must be 7 or less" },
                }}
                errors={errors}
              />

              <ControlledInput
                name="win_points_threshold"
                label="Points to Win Set"
                control={control}
                type="number"
                help_text="Points needed to win a single set"
                rules={{
                  min: { value: 1, message: "Must be at least 1" },
                  max: { value: 50, message: "Must be 50 or less" },
                }}
                errors={errors}
              />

              <ControlledInput
                name="win_margin"
                label="Winning Margin"
                control={control}
                type="number"
                help_text="Minimum point difference to win a set"
                rules={{
                  min: { value: 1, message: "Must be at least 1" },
                  max: { value: 10, message: "Must be 10 or less" },
                }}
                errors={errors}
              />
            </div>
          </div>
        </>
      )}

      {/* Banner Upload Section */}
      <Separator className="bg-border/50" />
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-4 w-4 text-primary" />
          <h3 className="text-lg font-semibold text-primary">
            Visual Settings
          </h3>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Sport Banner Image</Label>
          <ImageUpload
            onImageChange={handleImageChange}
            previewUrl={bannerPreview}
            existingImageUrl={sport?.banner}
            aspectRatio="16:9"
            className="w-full h-40"
            help_text="Upload a banner image for this sport (optional)"
          />
        </div>
      </div>

      {/* Form Actions */}
      <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto order-1 sm:order-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEdit ? "Update Sport" : "Create Sport"}</>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default SportForm;
