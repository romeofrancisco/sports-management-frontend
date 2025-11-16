import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useCreateCoach, useUpdateCoach } from "@/hooks/useCoaches";
import { useSports } from "@/hooks/useSports";
import { convertToFormData } from "@/utils/convertToFormData";
import { Loader2 } from "lucide-react";
import ControlledSelect from "../common/ControlledSelect";
import ControlledMultiSelect from "../common/ControlledMultiSelect";
import { SEX } from "@/constants/player";
import ControlledInput from "../common/ControlledInput";

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
  } = useForm({
    defaultValues: {
      first_name: coach?.first_name || "",
      last_name: coach?.last_name || "",
      sex: coach?.sex || "",
      email: coach?.email || "",
      sport_ids: coach?.sports?.map((sport) => sport.id) || [],
      profile: null,
    },
  });
  const onSubmit = (data) => {
    console.log("Form data before processing:", data);

    // Check if there's a file upload
    const hasFileUpload = data.profile && data.profile.length > 0;

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 px-1"
    >
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
      />
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
      {/* Profile */}
      <ControlledInput
        name="profile"
        label="Profile"
        type="file"
        accept="image/*"
        control={control}
        errors={errors}
      />{" "}
      <Button
        type="submit"
        className="mt-4"
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
