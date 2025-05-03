import { Label } from "@radix-ui/react-dropdown-menu";
import React from "react";
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
import { useCreateLeague, useUpdateLeague } from "@/hooks/useLeagues";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";

const LeagueForm = ({ sports, onClose, league = null }) => {
  const isEdit = !!league;
  const { mutate: createLeague, isPending: isCreating } = useCreateLeague();
  const { mutate: updateLeague, isPending: isUpdating } = useUpdateLeague();
  const isPending = isCreating || isUpdating;

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: league?.name || "",
      sport: isEdit ? String(league.sport.id) : "",
      logo: null,
    },
  });

  const onSubmit = (data) => {
    const formData = convertToFormData(data);
    
    const mutationFn = isEdit ? updateLeague : createLeague;
    const payload = isEdit ? [formData, league.id] : formData;

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
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 py-3 px-1">
      {/* League Name */}
      <div className="grid gap-1">
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
      <div className="grid gap-1">
        <Label className="text-sm text-left">Sport</Label>
        <Controller
          name="sport"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={isEdit}>
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

      {/* League Logo */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">League Logo</Label>
        <Controller
          name="logo"
          control={control}
          render={({ field }) => (
            <Input
              type="file"
              accept="image/*"
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

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Please wait
          </>
        ) : isEdit ? (
          "Update League"
        ) : (
          "Create League"
        )}
      </Button>
    </form>
  );
};

export default LeagueForm;