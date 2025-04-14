import React from "react";
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
import { useUpdatePlayer } from "@/hooks/usePlayers";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";
import useFilteredTeams from "@/hooks/useFilteredTeams";
import { COURSE_CHOICES, YEAR_LEVEL_CHOICES } from "@/constants/player";

const FormField = ({ label, error, children }) => (
  <div className="grid gap-0.5">
    <Label className="text-sm text-left">{label}</Label>
    {children}
    {error && <p className="text-xs text-left text-destructive">{error}</p>}
  </div>
);

const UpdatePlayerForm = ({ teams, sports, positions, onClose, player }) => {
  const { mutate: updatePlayer, isPending } = useUpdatePlayer(player.slug);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      first_name: player.first_name,
      last_name: player.last_name,
      email: player.email,
      year_level: player.year_level,
      course: player.course,
      profile: null,
      sport_id: String(player.sport.id),
      height: player.height,
      weight: player.weight,
      jersey_number: player.jersey_number,
      team_id: String(player.team.id),
      position_ids: player.positions?.map((p) => p.id),
    },
  });

  const selectedSport = watch("sport_id");
  const filteredTeams = useFilteredTeams(teams, sports, selectedSport);

  const onSubmit = (data) => {
    const formData = convertToFormData(data);

    updatePlayer(formData, {
      onSuccess: onClose,
      onError: (e) => {
        const error = e.response?.data;
        if (error) {
          Object.entries(error).forEach(([field, message]) =>
            setError(field, { type: "server", message })
          );
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 px-1">
      <h1 className="font-medium mb-2 text-lg">Personal Information</h1>

      <FormField label="First Name" error={errors.first_name?.message}>
        <Controller name="first_name" control={control} render={({ field }) => <Input {...field} />} />
      </FormField>

      <FormField label="Last Name" error={errors.last_name?.message}>
        <Controller name="last_name" control={control} render={({ field }) => <Input {...field} />} />
      </FormField>

      <FormField label="Email" error={errors.email?.message}>
        <Controller name="email" control={control} render={({ field }) => <Input type="email" {...field} />} />
      </FormField>

      <FormField label="Year Level" error={errors.year_level?.message}>
        <Controller
          name="year_level"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Year Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year Level</SelectLabel>
                  {YEAR_LEVEL_CHOICES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="Course" error={errors.course?.message}>
        <Controller
          name="course"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Course</SelectLabel>
                  {COURSE_CHOICES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField label="Profile" error={errors.profile?.message}>
        <Controller
          name="profile"
          control={control}
          render={({ field }) => (
            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files[0])} />
          )}
        />
      </FormField>

      <h1 className="font-medium text-lg mt-5 py-2 border-t">Player Information</h1>

      <FormField label="Sport" error={errors.sport_id?.message}>
        <Controller
          name="sport_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sport</SelectLabel>
                  {sports.map(({ id, name }) => (
                    <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <TeamSelect
        control={control}
        name="team_id"
        label="Team"
        placeholder="Select team"
        teams={filteredTeams}
        errorMessage={errors.team_id?.message}
      />

      <FormField label="Position" error={errors.position_ids?.message}>
        <Controller
          name="position_ids"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={positions.map((pos) => ({ value: pos.id, label: pos.name }))}
              max={3}
              value={field.value}
              onChange={field.onChange}
              placeholder="Select player position..."
            />
          )}
        />
      </FormField>

      <FormField label="Jersey #" error={errors.jersey_number?.message}>
        <Controller name="jersey_number" control={control} render={({ field }) => <Input type="number" {...field} />} />
      </FormField>

      <FormField label="Height" error={errors.height?.message}>
        <Controller name="height" control={control} render={({ field }) => <Input type="number" {...field} />} />
      </FormField>

      <FormField label="Weight" error={errors.weight?.message}>
        <Controller name="weight" control={control} render={({ field }) => <Input type="number" {...field} />} />
      </FormField>

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
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
