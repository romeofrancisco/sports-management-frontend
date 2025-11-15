import React, { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import MultiSelect from "../common/ControlledMultiSelect";
import ControlledInput from "../common/ControlledInput";
import ControlledSelect from "../common/ControlledSelect";
import ControlledTeamSelect from "../common/ControlledTeamSelect";
import { Loader2 } from "lucide-react";
import { convertToFormData } from "@/utils/convertToFormData";

import { useCreatePlayer, useUpdatePlayer } from "@/hooks/usePlayers";
import { useSportPositions } from "@/hooks/useSports";
import { useSportTeams } from "@/hooks/useTeams";
import { useAcademicInfoForm } from "@/hooks/useAcademicInfo";

import { SEX } from "@/constants/player";

const PlayerForm = ({ sports, onClose, player }) => {
  const isEdit = !!player;

  const { mutate: createPlayer, isPending: isCreating } = useCreatePlayer();
  const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    setValue,
  } = useForm({
    defaultValues: {
      first_name: player?.first_name || "",
      last_name: player?.last_name || "",
      email: player?.email || "",
      sex: player?.sex || "",
      profile: null,
      sport_slug: player?.sport?.slug || "",
      height: player?.height || "",
      weight: player?.weight || "",
      jersey_number: player?.jersey_number || "",
      team_id: player?.team?.id || "",
      position_ids: player?.positions?.map((pos) => pos.id) || [],
      // Academic info
      year_level: player?.academic_info?.year_level || "",
      course: player?.academic_info?.course || "",
      section: player?.academic_info?.section || null,
      academic_info_id: player?.academic_info?.id || null,
    },
  });

  // Watch cascading values
  const selectedSport = watch("sport_slug");
  const selectedSex = watch("sex");
  const selectedYear = watch("year_level");
  const selectedCourse = watch("course");
  const selectedSection = watch("section");

  const division = selectedSex;

  // Hooks
  const { data: positions } = useSportPositions(selectedSport);
  const { data: teams } = useSportTeams(selectedSport, division);

  // Academic Info
  const { data: allAcademic } = useAcademicInfoForm();
  const { data: coursesForYear } = useAcademicInfoForm(
    selectedYear ? { year_level: selectedYear } : undefined,
    { enabled: !!selectedYear }
  );
  const { data: sectionsForCourse } = useAcademicInfoForm(
    selectedYear && selectedCourse
      ? { year_level: selectedYear, course: selectedCourse }
      : undefined,
    { enabled: !!selectedYear && !!selectedCourse }
  );

  // Academic options
  const yearOptions = useMemo(() => {
    if (!allAcademic) return [];
    return [...new Set(allAcademic.map((a) => a.year_level))].map((y) => ({
      value: y,
      label: y,
    }));
  }, [allAcademic]);

  const courseOptions = useMemo(() => {
    if (!coursesForYear) return [];
    return [...new Set(coursesForYear.map((a) => a.course))].map((c) => ({
      value: c,
      label: c,
    }));
  }, [coursesForYear]);

  const sectionOptions = useMemo(() => {
    if (!sectionsForCourse) return [];
    const sections = [
      ...new Set(sectionsForCourse.map((a) => a.section || "")),
    ];
    return sections.map((s) => ({
      value: s || null,
      label: s || "None",
    }));
  }, [sectionsForCourse]);

  // Auto-resolve academic_info_id
  useEffect(() => {
    if (!sectionsForCourse) return;
    const normalizedSection = selectedSection === "" ? null : selectedSection;
    const match =
      sectionsForCourse.find((a) => a.section === normalizedSection) ||
      sectionsForCourse.find((a) => a.section == null);

    if (match) setValue("academic_info_id", match.id);
  }, [sectionsForCourse, selectedSection, setValue]);

  // Reset cascading values
  const yearDidMount = useRef(false);
  useEffect(() => {
    if (!yearDidMount.current) {
      yearDidMount.current = true;
      return;
    }
    setValue("course", "");
    setValue("section", "");
    setValue("academic_info_id", null);
  }, [selectedYear, setValue]);

  const courseDidMount = useRef(false);
  useEffect(() => {
    if (!courseDidMount.current) {
      courseDidMount.current = true;
      return;
    }
    setValue("section", "");
    setValue("academic_info_id", null);
  }, [selectedCourse, setValue]);

  // Reset team & positions when sport/sex changes
  useEffect(() => {
    if (!isEdit) {
      setValue("team_id", "");
      setValue("position_ids", []);
    }
  }, [selectedSex, selectedSport, setValue, isEdit]);

  // Submit Handler
  const onSubmit = (data) => {
    const payload = { ...data };

    // Normalize position_ids
    if (payload.position_ids && !Array.isArray(payload.position_ids)) {
      payload.position_ids = [payload.position_ids];
    }

    // Resolve academic_info_id if missing
    if (!payload.academic_info_id) {
      const normalizedSection = payload.section === "" ? null : payload.section;
      const match =
        sectionsForCourse?.find((a) => a.section === normalizedSection) ||
        sectionsForCourse?.find((a) => a.section == null) ||
        coursesForYear?.find((a) => a.section == null);
      if (match) payload.academic_info_id = match.id;
    }

    // Remove front-end only fields
    delete payload.year_level;
    delete payload.course;
    delete payload.section;

    // Handle file upload
    const hasFile =
      payload.profile instanceof File || payload.profile instanceof FileList;
    let requestData;
    if (hasFile) {
      const formData = convertToFormData(payload);
      requestData = isEdit ? { player: player.slug, data: formData } : formData;
    } else {
      delete payload.profile;
      requestData = isEdit ? { player: player.slug, data: payload } : payload;
    }

    const mutationFn = isEdit ? updatePlayer : createPlayer;
    mutationFn(requestData, {
      onSuccess: () => onClose(),
      onError: (e) => {
        const error = e.response?.data;
        if (error) {
          Object.entries(error).forEach(([field, message]) => {
            setError(field, {
              type: "server",
              message: Array.isArray(message) ? message[0] : message,
            });
          });
        }
      },
    });
  };

  // Initialize form values on edit after all data is loaded
  useEffect(() => {
    if (!player || !allAcademic) return;

    // Set the top-level academic values
    setValue("year_level", player.academic_info?.year_level || "");
    setValue("course", player.academic_info?.course || "");
    setValue("section", player.academic_info?.section || null);

    // Resolve academic_info_id once sections are loaded
    if (sectionsForCourse && sectionsForCourse.length > 0) {
      const normalizedSection = player.academic_info?.section || null;
      const match =
        sectionsForCourse.find((a) => a.section === normalizedSection) ||
        sectionsForCourse.find((a) => a.section == null);

      if (match) setValue("academic_info_id", match.id);
    }
  }, [player, allAcademic, sectionsForCourse, setValue]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8 px-4 py-6 max-w-2xl mx-auto"
    >
      {/* PERSONAL DETAILS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-primary">Personal Details</h2>
        <div className="grid grid-cols-2 gap-3">
          <ControlledInput
            name="first_name"
            label="First Name"
            placeholder="Enter first name"
            control={control}
            errors={errors}
          />
          <ControlledInput
            name="last_name"
            label="Last Name"
            placeholder="Enter last name"
            control={control}
            errors={errors}
          />
        </div>

        <ControlledSelect
          name="sex"
          control={control}
          label="Sex"
          placeholder="Select sex"
          options={SEX}
          valueKey="value"
          labelKey="label"
          errors={errors}
        />

        <ControlledInput
          name="email"
          label="Email Address"
          type="email"
          control={control}
          errors={errors}
        />

        <ControlledInput
          name="profile"
          label="Profile Photo"
          type="file"
          accept="image/*"
          control={control}
          errors={errors}
        />
      </div>

      {/* ACADEMIC DETAILS */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h2 className="text-lg font-bold text-primary">Academic Info</h2>
        <ControlledSelect
          name="year_level"
          control={control}
          label="Year Level"
          placeholder="Select year level"
          options={yearOptions}
          valueKey="value"
          labelKey="label"
          errors={errors}
        />
        <ControlledSelect
          name="course"
          control={control}
          label="Course"
          placeholder="Select course"
          options={courseOptions}
          disabled={!selectedYear}
          valueKey="value"
          labelKey="label"
          errors={errors}
        />
        <ControlledSelect
          name="section"
          control={control}
          label="Section"
          placeholder="Select section (optional)"
          options={sectionOptions}
          disabled={!selectedCourse}
          valueKey="value"
          labelKey="label"
          errors={errors}
        />
      </div>

      {/* PLAYER INFO */}
      <div className="space-y-4 pt-6 border-t border-border/60">
        <h2 className="text-lg font-bold text-primary">Player Info</h2>

        <ControlledSelect
          name="sport_slug"
          control={control}
          label="Sport"
          placeholder="Select sport"
          options={sports}
          valueKey="slug"
          labelKey="name"
          errors={errors}
        />

        <ControlledTeamSelect
          control={control}
          name="team_id"
          label="Team"
          placeholder={
            !selectedSport
              ? "Select sport first"
              : !selectedSex
              ? "Select sex first"
              : "Select team"
          }
          teams={teams}
          disabled={!selectedSport || !selectedSex}
          errors={errors}
        />

        <MultiSelect
          name="position_ids"
          label="Positions"
          control={control}
          options={positions}
          max={3}
          placeholder={
            !selectedSport ? "Select sport first" : "Select player positions"
          }
          disabled={!selectedSport}
          errors={errors}
        />

        <ControlledInput
          name="jersey_number"
          label="Jersey Number"
          type="number"
          control={control}
          errors={errors}
        />
        <ControlledInput
          name="height"
          label="Height (cm)"
          type="number"
          control={control}
          errors={errors}
        />
        <ControlledInput
          name="weight"
          label="Weight (kg)"
          type="number"
          control={control}
          errors={errors}
        />
      </div>

      <Button type="submit" disabled={isCreating || isUpdating}>
        {isCreating || isUpdating ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Please wait
          </>
        ) : isEdit ? (
          "Update Player"
        ) : (
          "Register Player"
        )}
      </Button>
    </form>
  );
};

export default PlayerForm;
