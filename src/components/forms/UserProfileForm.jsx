import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Loader2, Upload, User, Lock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/authApi";
import { toast } from "sonner";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import { SEX } from "@/constants/player";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/slices/authSlice";
import ControlledDatePicker from "../common/ControlledDatePicker";
import PasswordForm from "@/pages/auth/form/PasswordForm";

const UserProfileForm = ({ onClose, user, changePassword }) => {
  const [profilePreview, setProfilePreview] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const initialValues = {
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    sex: user?.sex || "",
    date_of_birth: user?.date_of_birth || "",
    phone_number: user?.phone_number || "",
    profile: null,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: initialValues,
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      dispatch(updateUser(data));
      queryClient.invalidateQueries(["user"]);
      toast.success("Profile updated successfully!", {
        richColors: true,
      });
      onClose();
    },
    onError: (error) => {
      const errorMsg =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(errorMsg);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("profile", file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
    }
  };

  const onSubmit = (data) => {
    // Create FormData for file upload
    const formData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      sex: data.sex,
      date_of_birth: data.date_of_birth || null,
      phone_number: data.phone_number || "",
      ...(data.profile && { profile: data.profile }),
    };

    updateProfile(formData);
  };

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  // determine if any form values changed compared to initial values
  const watched = watch([
    "first_name",
    "last_name",
    "email",
    "sex",
    "date_of_birth",
    "phone_number",
  ]);

  const profileFile = watch("profile");

  const hasChanges = (() => {
    // if a new profile file selected, that's a change
    if (profileFile) return true;
    const keys = [
      "first_name",
      "last_name",
      "email",
      "sex",
      "date_of_birth",
      "phone_number",
    ];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const initial = (initialValues[key] ?? "").toString().trim();
      const current = (watched?.[i] ?? "").toString().trim();
      if (initial !== current) return true;
    }
    return false;
  })();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-1 mt-1">
      {/* Profile Picture */}
      <section className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24 ring-2 ring-border shadow-md">
          <AvatarImage
            src={profilePreview || user?.profile}
            alt={`${user?.first_name} ${user?.last_name}`}
          />
          <AvatarFallback className="text-lg font-semibold">
            {user?.first_name?.[0]}
            {user?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col items-center gap-2">
          <Label htmlFor="profile-upload" className="cursor-pointer">
            <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
              <Upload className="h-4 w-4" />
              <span>Upload new photo</span>
            </div>
          </Label>
          <Input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF (max. 5MB)
          </p>
        </div>
      </section>

      {/* Personal Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ControlledInput
            control={control}
            name="first_name"
            label="First Name"
            placeholder="Enter first name"
            rules={{
              required: "First name is required",
              minLength: {
                value: 2,
                message: "First name must be at least 2 characters",
              },
            }}
            error={errors.first_name}
          />

          <ControlledInput
            control={control}
            name="last_name"
            label="Last Name"
            placeholder="Enter last name"
            rules={{
              required: "Last name is required",
              minLength: {
                value: 2,
                message: "Last name must be at least 2 characters",
              },
            }}
            error={errors.last_name}
          />

          <ControlledSelect
            control={control}
            name="sex"
            label="Gender"
            placeholder="Select gender"
            options={SEX}
            rules={{ required: "Gender is required" }}
            error={errors.sex}
          />

          <ControlledDatePicker
            control={control}
            name="date_of_birth"
            label="Date of Birth"
            placeholder="Select your birth date"
            error={errors.date_of_birth}
          />
        </div>
      </section>

      {/* Contact Info */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase">
          Contact Information
        </h3>
        <div className="grid gap-4">
          <ControlledInput
            control={control}
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email address"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            error={errors.email}
          />

          <ControlledInput
            control={control}
            name="phone_number"
            label="Phone Number"
            placeholder="Enter phone number (optional)"
            error={errors.phone_number}
          />
        </div>
      </section>

      {/* Actions */}

      <div className="grid gap-3 w-full py-2">
        <Button type="button" variant="outline" onClick={changePassword}>
          <Lock />
          Change Password
        </Button>
        <Button type="submit" disabled={isPending || !hasChanges}>
          {isPending && <Loader2 className="animate-spin" />}
          Update Profile
        </Button>
      </div>
    </form>
  );
};

export default UserProfileForm;
