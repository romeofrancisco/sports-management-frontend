import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useCreateCoach, useUpdateCoach } from "@/hooks/useCoaches";
import { convertToFormData } from "@/utils/convertToFormData";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { SEX } from "@/constants/player";

const CoachForm = ({ onClose, coach = null }) => {
  const isEdit = !!coach;
  const { mutate: createCoach, isPending: isCreating } = useCreateCoach();
  const { mutate: updateCoach, isPending: isUpdating } = useUpdateCoach();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      sex: "",
      email: "",
      password: "",
      profile: null,
    },
  });

  useEffect(() => {
    if (isEdit) {
      reset({
        first_name: coach.first_name || "",
        last_name: coach.last_name || "",
        sex: coach.sex || "",
        email: coach.email || "",
        password: "",
        profile: null,
      });
    }
  }, [coach, reset, isEdit]);

  const onSubmit = (data) => {
    const formData = convertToFormData(data);

    const mutationFn = isEdit ? updateCoach : createCoach;
    const payload = isEdit ? { id: coach.id, data: formData } : formData;

    mutationFn(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (e) => {
        const error = e.response?.data;
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 px-1">
      {/* First Name */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">First Name</Label>
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
      <div className="grid gap-1">
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

      {/* Sex */}
      <div className="grid gap-1">
        <Label className="text-sm text-left">Sex</Label>
        <Controller
          name="sex"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sex</SelectLabel>
                  {SEX.map((sex) => (
                    <SelectItem key={sex.value} value={sex.value}>
                      {sex.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.sex && (
          <p className="text-xs text-left text-destructive">
            {errors.sex.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="grid gap-1">
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

      {/* Password */}
      {!isEdit && (
        <div className="grid gap-1">
          <Label className="text-sm text-left">
            Password {isEdit && "(Leave blank to keep current password)"}
          </Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => <Input type="password" {...field} />}
          />
          {errors.password && (
            <p className="text-xs text-left text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      )}

      {/* Profile */}
      <div className="grid gap-1">
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

      <Button type="submit" className="mt-4" disabled={isCreating || isUpdating}>
        {(isCreating || isUpdating) ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : isEdit ? (
          "Update Coach"
        ) : (
          "Register Coach"
        )}
      </Button>
    </form>
  );
};

export default CoachForm;
