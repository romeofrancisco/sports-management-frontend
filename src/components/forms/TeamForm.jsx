import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useCreateTeam, useUpdateTeam } from "@/hooks/useTeams";
import { DIVISIONS } from "@/constants/team";
import ControlledSelect from "../common/ControlledSelect";
import ControlledInput from "../common/ControlledInput";
import ControlledCombobox from "../common/ControlledCombobox";
import SelectCoach from "../common/SelectCoach";
import { convertToFormData } from "@/utils/convertToFormData";

const TeamForm = ({ coaches, sports, onClose, team = null }) => {
  const isEdit = Boolean(team);
  const [logoPreview, setLogoPreview] = useState(team?.logo || null);
  const { mutate: createTeam, isPending: isCreating } = useCreateTeam();
  const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: team?.name || "",
      abbreviation: team?.abbreviation || "",
      color: team?.color || "#000000",
      sport: team?.sport || "",
      division: team?.division || "",
      head_coach: team?.head_coach || "",
      // assistant_coach: team?.assistant_coach || "", // Temporarily removed
      logo: null,
    },
  });

  const logoFile = watch("logo");
  const teamColor = watch("color");
  const selectedSport = watch("sport");

  // Filter coaches based on selected sport
  const filteredCoaches = React.useMemo(() => {
    if (!selectedSport || !coaches) return [];
    
    return coaches.filter(coach => {
      // Check if coach can coach the selected sport
      return coach.sports && coach.sports.some(sport => sport.id === parseInt(selectedSport));
    });
  }, [coaches, selectedSport]);

  useEffect(() => {
    if (logoFile && logoFile.length > 0) {
      const file = logoFile[0];
      const url = URL.createObjectURL(file);
      setLogoPreview(url);

      // Clean up the URL object when component unmounts or file changes
      return () => URL.revokeObjectURL(url);
    }
  }, [logoFile]);

  // Clear head_coach when sport changes (except during initial load for edit mode)
  useEffect(() => {
    if (selectedSport && !isEdit) {
      setValue("head_coach", "");
    }
  }, [selectedSport, setValue, isEdit]);
  const onSubmit = (teamData) => {
    const data = convertToFormData(teamData);

    const mutationFn = isEdit ? updateTeam : createTeam;
    const payload = isEdit ? { team: team.slug, data: data } : data;

    mutationFn(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (e) => {
        const error = e.response.data;
        if (error) {
          Object.keys(error).forEach((fieldName) => {
            setError(fieldName, {
              type: "server",
              message: error[fieldName],
            });
          });
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 px-1">
      <div
        className="size-[7rem] place-self-center text-center content-center border-2 p-3"
        style={{ backgroundColor: teamColor }}
      >
        {logoPreview ? (
          <img
            className="size-full object-cover"
            src={logoPreview}
            alt="Team Logo"
          />
        ) : (
          "Team Logo"
        )}
      </div>
      {/* Team Name */}
      <ControlledInput
        name="name"
        control={control}
        label="Team Name"
        placeholder="Enter Team Name"
        errors={errors}
      />
      {/* Team Name */}
      <ControlledInput
        name="abbreviation"
        control={control}
        label="Abbreviation"
        help_text="Team's short name"
        placeholder="Enter Team Abbreviation"
        errors={errors}
      />
      {/* Team Logo */}
      <ControlledInput
        name="logo"
        control={control}
        label="Team Logo"
        type="file"
        accept="image/*"
        errors={errors}
      />
      <ControlledInput
        name="color"
        control={control}
        label="Team Color"
        type="color"
        errors={errors}
      />
      {/* Sport */}
      <ControlledSelect
        name="sport"
        control={control}
        label="Sport"
        placeholder="Select Sport"
        options={sports}
        valueKey="id"
        labelKey="name"
        errors={errors}
        disabled={isEdit}
      />
      {/* Division */}
      <ControlledSelect
        name="division"
        control={control}
        label="Division"
        placeholder="Select Team Division"
        options={DIVISIONS}
        errors={errors}
      />{" "}
      {/* Head Coach */}
      <SelectCoach
        name="head_coach"
        control={control}
        label="Coach"
        coaches={filteredCoaches}
        placeholder={selectedSport ? "Select Coach" : "Select Sport first"}
        disabled={!selectedSport || filteredCoaches.length === 0}
        errors={errors}
        help_text={
          !selectedSport 
            ? "Please select a sport first to see available coaches"
            : filteredCoaches.length === 0 
            ? "No coaches available for this sport"
            : "Coach who can manage this sport"
        }
      />
      {/* Assistant Coach - Temporarily Removed */}
      {/* <ControlledCombobox
        name="assistant_coach"
        control={control}
        label="Assistant Coach"
        options={coaches}
        placeholder="Select Assistant Coach"
        help_text="Secondary coach to support the team (optional)"
        errors={errors}
        valueKey="id"
        labelKey="full_name"
      /> */}
      <Button
        type="submit"
        className="mt-4"
        disabled={isCreating || isUpdating}
      >
        {isCreating || isUpdating ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : isEdit ? (
          "Update Team"
        ) : (
          "Register Team"
        )}
      </Button>
    </form>
  );
};

export default TeamForm;
