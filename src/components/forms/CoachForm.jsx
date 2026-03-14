import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useCreateCoach, useUpdateCoach } from "@/hooks/useCoaches";
import { useSports } from "@/hooks/useSports";
import { convertToFormData } from "@/utils/convertToFormData";
import { Loader2, Upload, User, X } from "lucide-react";
import ControlledSelect from "../common/ControlledSelect";
import ControlledMultiSelect from "../common/ControlledMultiSelect";
import { SEX } from "@/constants/player";
import ControlledInput from "../common/ControlledInput";
import ControlledDatePicker from "../common/ControlledDatePicker";
import { toast } from "sonner";

const CoachForm = ({ onClose, coach = null }) => {
  const isEdit = !!coach;

  const { mutate: createCoach, isPending: isCreating } = useCreateCoach();
  const { mutate: updateCoach, isPending: isUpdating } = useUpdateCoach();
  const { data: sports = [], isLoading: sportsLoading } = useSports();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      first_name: coach?.first_name || "",
      last_name: coach?.last_name || "",
      sex: coach?.sex || "",
      date_of_birth: coach?.date_of_birth || null,
      email: coach?.email || "",
      sport_ids: coach?.sports?.map((sport) => sport.id) || [],
      profile: null,
    },
  });

  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");

  const currentProfileImage = useMemo(() => {
    const source =
      coach?.profile_url ||
      coach?.profile_photo ||
      coach?.profile ||
      coach?.image ||
      coach?.avatar;

    if (!source) return "";
    if (typeof source === "string") return source;
    if (typeof source === "object") {
      return source.url || source.file_url || source.image || "";
    }

    return "";
  }, [coach]);

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) {
        URL.revokeObjectURL(profilePreviewUrl);
      }
    };
  }, [profilePreviewUrl]);

  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum profile image size is 5MB",
        richColors: true,
      });
      return;
    }

    const allowedTypes = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedTypes.includes(ext)) {
      toast.error("Invalid file type", {
        description: `Allowed types: ${allowedTypes.join(", ")}`,
        richColors: true,
      });
      return;
    }

    if (profilePreviewUrl) {
      URL.revokeObjectURL(profilePreviewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setProfilePreviewUrl(objectUrl);
    setValue("profile", file, { shouldValidate: true, shouldDirty: true });
  };

  const removeProfileImage = () => {
    if (profilePreviewUrl) {
      URL.revokeObjectURL(profilePreviewUrl);
    }

    setProfilePreviewUrl("");
    setValue("profile", null, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (data) => {
    console.log("Form data before processing:", data);

    // Check if there's a file upload
    const hasFileUpload =
      data.profile instanceof File ||
      (data.profile instanceof FileList && data.profile.length > 0);

    if (hasFileUpload) {
      // Use FormData for file uploads
      const formData = convertToFormData(data);

      // Handle sport_ids specially - remove the [] suffix that convertToFormData adds
      formData.delete("sport_ids[]");

      if (data.sport_ids && data.sport_ids.length > 0) {
        // Add each sport ID as a separate entry
        data.sport_ids.forEach((sportId) => {
          formData.append("sport_ids", sportId);
        });
      }

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
    } else {
      // Use JSON for data without file uploads
      const jsonData = { ...data };
      delete jsonData.profile; // Remove profile if it's empty

      const mutationFn = isEdit ? updateCoach : createCoach;
      const payload = isEdit ? { id: coach.id, data: jsonData } : jsonData;

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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1">
      <div className="flex flex-col items-center gap-3 pt-4">
        <div className="relative">
          {profilePreviewUrl || currentProfileImage ? (
            <div className="relative">
              <img
                src={profilePreviewUrl || currentProfileImage}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
              />
              {profilePreviewUrl && (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleProfileUpload}
              />
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/50 flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
                <User className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Upload</span>
              </div>
            </label>
          )}
        </div>
        {(profilePreviewUrl || currentProfileImage) && (
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleProfileUpload}
            />
            <Button type="button" size="sm" variant="outline" asChild>
              <span className="cursor-pointer">
                <Upload className="h-4 w-4 mr-1" />
                Change Photo
              </span>
            </Button>
          </label>
        )}
        <p className="text-xs text-muted-foreground">
          Profile photo (optional, max 5MB)
        </p>
        {profilePreviewUrl && isEdit && currentProfileImage && (
          <p className="text-xs text-muted-foreground">
            Saving this form will replace the current profile photo.
          </p>
        )}
        {errors?.profile && (
          <p className="text-xs text-destructive">{errors.profile.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* First Name */}
        <ControlledInput
          name="first_name"
          label="First Name"
          placeholder="Enter first name"
          control={control}
          errors={errors}
        />
        {/* Last Name */}
        <ControlledInput
          name="last_name"
          label="Last Name"
          placeholder="Enter last name"
          control={control}
          errors={errors}
          optional={true}
        />
      </div>
      {/* Sex */}
      <ControlledSelect
        name="sex"
        control={control}
        label="Sex"
        placeholder="Select sex..."
        groupLabel="Sex"
        options={SEX}
        errors={errors}
      />{" "}
      {/* Date of Birth */}
      <ControlledDatePicker
        name="date_of_birth"
        label="Date of Birth"
        placeholder="Select date of birth"
        control={control}
        errors={errors}
        rules={{ required: "Date of birth is required" }}
      />{" "}
      {/* Email */}
      <ControlledInput
        name="email"
        label="Email"
        placeholder="Enter Email"
        type="email"
        control={control}
        errors={errors}
      />{" "}
      {/* Sports */}
      <ControlledMultiSelect
        name="sport_ids"
        control={control}
        label="Sports"
        placeholder="Select sports the coach can handle..."
        help_text="Select which sports this coach is qualified to handle"
        options={sports}
        valueKey="id"
        labelKey="name"
        errors={errors}
      />
      {/* Display current team assignments if editing */}
      {isEdit && coach && (
        <div className="space-y-2">
          {coach.head_coached_teams && coach.head_coached_teams.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Head Coach of:
              </label>
              <div className="mt-1 space-y-1">
                {coach.head_coached_teams.map((team) => (
                  <div
                    key={team.id}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <span className="font-medium">{team.name}</span>
                    <span className="ml-2 text-gray-500">
                      ({team.sport_name})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {coach.assistant_coached_teams &&
            coach.assistant_coached_teams.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Assistant Coach of:
                </label>
                <div className="mt-1 space-y-1">
                  {coach.assistant_coached_teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <span className="font-medium">{team.name}</span>
                      <span className="ml-2 text-gray-500">
                        ({team.sport_name})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {(!coach.head_coached_teams ||
            coach.head_coached_teams.length === 0) &&
            (!coach.assistant_coached_teams ||
              coach.assistant_coached_teams.length === 0) && (
              <div className="text-sm text-gray-500">
                This coach is not currently assigned to any teams.
              </div>
            )}
        </div>
      )}
      <Button
        type="submit"
        className="mb-5 md:mb-0 mt-2 w-full"
        disabled={isCreating || isUpdating || sportsLoading}
      >
        {isCreating || isUpdating ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : sportsLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Loading sports...
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
