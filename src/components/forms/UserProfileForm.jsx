import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Loader2, Upload, User, Calendar, Phone, Mail } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/authApi";
import { toast } from "sonner";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import { SEX } from "@/constants/player";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/slices/authSlice";
import ControlledDatePicker from "../common/ControlledDatePicker";

const UserProfileForm = ({ onClose, user }) => {
  const [profilePreview, setProfilePreview] = useState(null);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      sex: user?.sex || "",
      date_of_birth: user?.date_of_birth || "",
      phone_number: user?.phone_number || "",
      profile: null,
    },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information & Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center justify-center gap-2 w-full">
            <Avatar className="h-20 w-20 ring-2 ring-border">
              <AvatarImage
                src={profilePreview || user?.profile}
                alt={`${user?.first_name} ${user?.last_name}`}
              />
              <AvatarFallback className="text-lg font-semibold">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
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
              <p className="text-xs text-center text-muted-foreground mt-1">
                JPG, PNG or GIF (max. 5MB)
              </p>
            </div>
          </div>

          {/* Personal Details */}
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Role-specific Information */}
          {/* {user?.player_details && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium text-sm text-muted-foreground mb-3">
                Player Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">
                    Team:
                  </span>
                  <p>{user.player_details.team_name || "No team assigned"}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Jersey:
                  </span>
                  <p>#{user.player_details.jersey_number}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Year Level:
                  </span>
                  <p>{user.player_details.year_level}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">
                    Course:
                  </span>
                  <p>{user.player_details.course}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Player-specific details can be edited through the Players
                management section.
              </p>
            </div>
          )} */}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Profile
        </Button>
      </div>
    </form>
  );
};

export default UserProfileForm;
