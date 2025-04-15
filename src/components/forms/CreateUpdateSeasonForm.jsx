import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { useCreateSeason, useUpdateSeason } from "@/hooks/useSeasons";
import { useIsMobile } from "@/lib/hooks/use-mobile";
import { convertToFormData } from "@/utils/convertToFormData";

const CreateUpdateSeasonForm = ({ league, teams, onClose, season }) => {
  const { mutate: createSeason, isPending: creating } = useCreateSeason(league);
  const { mutate: updateSeason, isPending: updating } = useUpdateSeason(league);

  const isPending = creating || updating;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
    clearErrors
  } = useForm({
    defaultValues: {
      name: season?.name || "",
      year: season?.year || "",
      start_date: season?.start_date || null,
      end_date: season?.end_date || null,
      is_recorded: season?.is_recorded ?? true,
      teams: season?.teams_list?.map((t) => t.id) || [],
    },
  });

  const selectedTeams = watch("teams") || [];

  const [dateRange, setDateRange] = useState({
    from: season?.start_date ? new Date(season.start_date) : null,
    to: season?.end_date ? new Date(season.end_date) : null,
  });

  const onDateSelect = (range) => {
    setDateRange(range);
    setValue("start_date", range?.from ?? null);
    setValue("end_date", range?.to ? format(range.to, "yyyy-MM-dd") : null);
  };

  const onToggleAllTeams = (checked) => {
    setValue("teams", checked ? teams.map((t) => t.id) : []);
  };

  const onToggleTeam = (checked, id) => {
    setValue(
      "teams",
      checked
        ? [...selectedTeams, id]
        : selectedTeams.filter((teamId) => teamId !== id)
    );
  };

  const onSubmit = (data) => {
    const formData = convertToFormData(data);
    const mutation = season ? updateSeason : createSeason;
    const options = {
      onSuccess: onClose,
      onError: (err) => {
        const errorData = err.response?.data;
        if (errorData) {
          Object.entries(errorData).forEach(([field, message]) => {
            setError(field, { type: "server", message });
          });
        }
      },
    };

    season
      ? mutation({ id: season.id, data: formData }, options)
      : mutation(formData, options);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
      {/* Season Name */}
      <FormField label="Season Name" error={errors.name}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </FormField>

      {/* Year */}
      <FormField label="Year" error={errors.year}>
        <Controller
          name="year"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </FormField>

      {/* Date Range */}
      <FormField
        label="Date Range"
        error={[errors.start_date, errors.end_date].filter(Boolean)}
      >
        <Controller
          control={control}
          name="start_date"
          render={({ field: { onChange, value } }) => (
            <Controller
              control={control}
              name="end_date"
              render={({
                field: { onChange: onChangeEnd, value: valueEnd },
              }) => {
                const dateRange = {
                  from: value ? new Date(value) : null,
                  to: valueEnd ? new Date(valueEnd) : null,
                };

                const handleRangeSelect = (range) => {
                  onChange(
                    range?.from ? format(range.from, "yyyy-MM-dd") : null
                  );
                  onChangeEnd(
                    range?.to ? format(range.to, "yyyy-MM-dd") : null
                  );
                };

                return (
                  <DateRangePicker
                    date={dateRange}
                    onSelect={handleRangeSelect}
                  />
                );
              }}
            />
          )}
        />
      </FormField>

      {/* Is Stats Recorded */}
      <div className="flex items-center gap-2 mt-2">
        <Controller
          name="is_recorded"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(!!checked)}
            />
          )}
        />
        <Label className="text-sm">Record stats for this season</Label>
      </div>

      {/* Team Selection */}
      <FormField label="Teams" error={errors.teams}>
        <TeamSelection
          sportTeams={teams}
          selectedTeams={selectedTeams}
          handleToggleAllTeams={onToggleAllTeams}
          handleToggleTeam={onToggleTeam}
        />
      </FormField>

      {/* Submit Button */}
      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
            Please wait
          </>
        ) : season ? (
          "Update Season"
        ) : (
          "Create Season"
        )}
      </Button>
    </form>
  );
};

// Reusable field with label + error
const FormField = ({ label, error, children }) => (
  <div className="grid gap-1">
    <Label className="text-sm text-left">{label}</Label>
    {children}
    {Array.isArray(error)
      ? error.map((err, index) => (
          <p key={index} className="text-xs text-left text-destructive">
            {err?.message}
          </p>
        ))
      : error && (
          <p className="text-xs text-left text-destructive">{error.message}</p>
        )}
  </div>
);

// Date picker with popover
const DateRangePicker = ({ date, onSelect }) => {
  const isMobile = useIsMobile();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date?.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={date}
          onSelect={onSelect}
          defaultMonth={date?.from}
          numberOfMonths={isMobile ? 1 : 2}
        />
      </PopoverContent>
    </Popover>
  );
};

// Team selection UI
const TeamSelection = ({
  sportTeams,
  selectedTeams,
  handleToggleAllTeams,
  handleToggleTeam,
  error,
}) => (
  <div className="border-y py-2 mt-2">
    <div className="flex items-center gap-2 mb-2 border-b py-1">
      <Checkbox
        checked={
          sportTeams.length > 0 && selectedTeams.length === sportTeams.length
        }
        onCheckedChange={handleToggleAllTeams}
      />
      <Label className="text-sm">Teams</Label>
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
    <div className="grid grid-cols-2 gap-3">
      {sportTeams.map((team) => (
        <div key={team.id} className="flex items-center gap-2">
          <Checkbox
            checked={selectedTeams.includes(team.id)}
            onCheckedChange={(checked) => handleToggleTeam(checked, team.id)}
          />
          <Avatar>
            <AvatarImage src={team.logo} alt={team.name} />
          </Avatar>
          <span className="text-sm">{team.name}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CreateUpdateSeasonForm;
