import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label"; // Correct import path for Label
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelect from "../common/MultiSelect";
import { Button } from "../ui/button";
import { useCreateTeam } from "@/hooks/mutations/useCreateTeam";

const CreateTeamForm = ({ coaches, sports, onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      sport: "",
      coach: [],
      logo: null,
    },
  });

  const createTeam = useCreateTeam();
  const onSubmit = (teamData) => {
    createTeam.mutate(teamData, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-4">
      {/* Team Name */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">Team Name</Label>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Team name is required" }}
          render={({ field }) => <Input {...field} />}
        />
        {errors.name && (
          <p className="text-xs text-left text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>
      {/* Sport */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">Sport</Label>
        <Controller
          name="sport"
          control={control}
          rules={{ required: "Sport selection is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sports</SelectLabel>
                  {sports.map((sport) => (
                    <SelectItem key={sport.id} value={String(sport.id)}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.sport && (
          <p className="text-xs text-left text-destructive">
            {errors.sport.message}
          </p>
        )}
      </div>
      {/* Coach */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">Coach</Label>
        <Controller
          name="coach"
          control={control}
          rules={{ required: "At least one coach must be selected" }}
          render={({ field }) => (
            <MultiSelect
              options={coaches.map((coach) => ({
                value: coach.id,
                label: `${coach.first_name} ${coach.last_name}`,
              }))}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select coaches..."
            />
          )}
        />
        {errors.coach && (
          <p className="text-xs text-left text-destructive">
            {errors.coach.message}
          </p>
        )}
      </div>

      {/* Team Logo */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">Team Logo</Label>
        <Controller
          name="logo"
          control={control}
          rules={{ required: "Team logo is required" }}
          render={({ field }) => (
            <Input
              type="file"
              onChange={(e) => field.onChange(e.target.files[0])}
            />
          )}
        />
        {errors.logo && (
          <p className="text-xs text-left text-destructive">
            {errors.logo.message}
          </p>
        )}
      </div>
      <Button type="submit" className="mt-4">
        Create Team
      </Button>
    </form>
  );
};

export default CreateTeamForm;
