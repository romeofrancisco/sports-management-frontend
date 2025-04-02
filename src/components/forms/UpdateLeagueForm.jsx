import { Label } from "@radix-ui/react-dropdown-menu";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
} from "../ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Avatar } from "../ui/avatar";
import { AvatarImage } from "../ui/avatar";
import { useCreateLeague, useUpdateLeague } from "@/hooks/useLeagues";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { convertToFormData } from "@/utils/convertToFormData";

// DatePicker Component
const DatePicker = ({ label, control, name, error }) => (
  <div>
    <Label className="text-sm text-left">{label}</Label>
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-xs text-left font-normal md:text-sm",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {value ? (
                format(value, "PPP")
              ) : (
                <span>Pick {label.toLowerCase()}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={value ? new Date(value + "T00:00:00") : null}
              onSelect={(date) => {
                const localDate = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate()
                );
                const formatted = format(localDate, "yyyy-MM-dd");
                onChange(formatted);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    />
    {error && (
      <p className="text-xs text-left text-destructive">{error.message}</p>
    )}
  </div>
);

// TeamSelection Component
const TeamSelection = ({
  sportTeams,
  selectedTeams,
  handleToggleAllTeams,
  handleToggleTeam,
  error,
}) => (
  <div className="border-y py-2">
    <div className="flex items-center gap-2 mb-2 border-b py-1">
      <Checkbox
        checked={
          sportTeams.length > 0 && selectedTeams.length === sportTeams.length
        }
        onCheckedChange={handleToggleAllTeams}
      />
      <Label className="text-sm">Teams</Label>
      {error && (
        <p className="text-xs text-left text-destructive">{error.message}</p>
      )}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {sportTeams.map((team) => (
        <div key={team.id} className="flex items-center gap-2">
          <Checkbox
            checked={selectedTeams.includes(team.id)}
            onCheckedChange={(checked) => handleToggleTeam(checked, team.id)}
          />
          <Avatar>
            <AvatarImage sizes="xs" src={team.logo} alt={team.name} />
          </Avatar>
          <span className="text-sm">{team.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const UpdateLeagueForm = ({ sports, teams, onClose, league }) => {
  const { mutate: updateLeague, isPending } = useUpdateLeague(league?.id);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
        name: league.name,
        sport: String(league.sport),
        start_date: league.start_date,
        end_date: league.end_date,
        teams: league.teams.map(team => team.id),
    },
  });

  const selectedSport = watch("sport");
  const selectedTeams = watch("teams") || [];

  // Filter teams based on the selected sport
  const sportTeams = useMemo(
    () => teams.filter((team) => String(team.sport) === selectedSport),
    [teams, selectedSport]
  );

  const onSubmit = (data) => {
    const formData = convertToFormData(data);
    updateLeague(formData, {
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

  const handleToggleAllTeams = (checked) => {
    setValue("teams", checked ? sportTeams.map((team) => team.id) : []);
  };

  const handleToggleTeam = (checked, teamId) => {
    setValue(
      "teams",
      checked
        ? [...selectedTeams, teamId]
        : selectedTeams.filter((id) => id !== teamId)
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-3 px-1">
      {/* League Name */}
      <div>
        <Label className="text-sm text-left">Name</Label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
        {errors.name && (
          <p className="text-xs text-left text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Sport Select */}
      <div>
        <Label className="text-sm text-left">Sport</Label>
        <Controller
          name="sport"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled>
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

      <div className="grid grid-cols-2 gap-2">
        {/* Start Date Picker */}
        <DatePicker
          label="Start Date"
          control={control}
          name="start_date"
          error={errors.start_date}
        />

        {/* End Date Picker */}
        <DatePicker
          label="End Date"
          control={control}
          name="end_date"
          error={errors.end_date}
        />
      </div>

      {/* Teams Selection */}
      {selectedSport && (
        <TeamSelection
          sportTeams={sportTeams}
          selectedTeams={selectedTeams}
          handleToggleAllTeams={handleToggleAllTeams}
          handleToggleTeam={handleToggleTeam}
          error={errors.teams}
        />
      )}

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Please wait
          </>
        ) : (
          "Update League"
        )}
      </Button>
    </form>
  );
};

export default UpdateLeagueForm;
