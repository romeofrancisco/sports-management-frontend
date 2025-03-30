import React, { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamSelect } from "../common/TeamSelect";
import MultiSelect from "../common/MultiSelect";
import { useUpdatePlayer } from "@/hooks/mutations/player/useUpdatePlayer";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";
import useFilteredTeams from "@/hooks/useFilteredTeams";

const UpdatePlayerForm = ({ teams, sports, positions, onClose, player }) => {
  const { mutate: updatePlayer, isPending } = useUpdatePlayer(player.slug);
  const { control, handleSubmit, formState: { errors }, watch, setError } = useForm({
    defaultValues: {
      first_name: player.first_name,
      last_name: player.last_name,
      email: player.email,
      profile: null,
      sport_id: String(player.sport.id),
      height: player.height,
      weight: player.weight,
      jersey_number: player.jersey_number,
      team_id: String(player.team.id),
      position_ids: player.positions?.map((position) => position.id),
    },
  });

  const selectedSport = watch("sport_id");

  const filteredTeams = useFilteredTeams(teams, sports, selectedSport);

  const onSubmit = (playerData) => {
    const formData = convertToFormData(playerData);

    updatePlayer(formData, {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 px-1"
    >
      <h1 className="font-medium mb-2 text-lg">Personal Information</h1>
      {/* First Name */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left ">First Name</Label>
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.first_name && (
          <p className="text-xs text-left text-destructive">
            {errors.first_name.message}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Last Name</Label>
        <Controller
          name="last_name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.last_name && (
          <p className="text-xs text-left text-destructive">
            {errors.last_name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Email</Label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input type="email" {...field} />}
        />
        {errors.email && (
          <p className="text-xs text-left text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Profile */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Profile</Label>
        <Controller
          name="profile"
          control={control}
          render={({ field }) => (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files[0])}
            />
          )}
        />
        {errors.profile && (
          <p className="text-xs text-left text-destructive">
            {errors.profile.message}
          </p>
        )}
      </div>

      <h1 className="font-medium text-lg mt-5 py-2 border-t">
        Player Information
      </h1>

      {/* Sport */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Sport</Label>
        <Controller
          name="sport_id"
          control={control}
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
        {errors.sport_id && (
          <p className="text-xs text-left text-destructive">
            {errors.sport_id.message}
          </p>
        )}
      </div>

      {/* Team */}
      <TeamSelect
        control={control}
        name="team_id"
        label="Team"
        placeholder="Select team"
        teams={filteredTeams}
        errorMessage={errors.team_id?.message}
      />

      {/* Position */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Position</Label>
        <Controller
          name="position_ids"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={positions.map((position) => ({
                value: position.id,
                label: position.name,
              }))}
              max={3}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select player position..."
            />
          )}
        />
        {errors.position_ids && (
          <p className="text-xs text-left text-destructive">
            {errors.position_ids.message}
          </p>
        )}
      </div>

      {/* Jersey # */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Jersey #</Label>
        <Controller
          name="jersey_number"
          control={control}
          render={({ field }) => <Input type="number" {...field} />}
        />
        {errors.jersey_number && (
          <p className="text-xs text-left text-destructive">
            {errors.jersey_number.message}
          </p>
        )}
      </div>

      {/* Height */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Height</Label>
        <Controller
          name="height"
          control={control}
          render={({ field }) => <Input type="number" {...field} />}
        />
        {errors.height && (
          <p className="text-xs text-left text-destructive">
            {errors.height.message}
          </p>
        )}
      </div>

      {/* Weight */}
      <div className="grid gap-0.5">
        <Label className="text-sm text-left">Weight</Label>
        <Controller
          name="weight"
          control={control}
          render={({ field }) => <Input type="number" {...field} />}
        />
        {errors.weight && (
          <p className="text-xs text-left text-destructive">
            {errors.weight.message}
          </p>
        )}
      </div>

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          "Update Player"
        )}
      </Button>
    </form>
  );
};

export default UpdatePlayerForm;
