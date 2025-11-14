import React, { useEffect, useState, useMemo } from "react";
import Modal from "@/components/common/Modal";
import { GraduationCap } from "lucide-react";
import { useForm } from "react-hook-form";
import { AutoComplete } from "@/components/common/AutoComplete";
import { useAcademicInfoForm } from "@/hooks/useAcademicInfo";
import { Button } from "@/components/ui/button";
import {
  useCreateAcademicInfo,
  useUpdateAcademicInfo,
} from "@/hooks/useAcademicInfo";
import { Label } from "@/components/ui/label";

const CourseSectionsModal = ({ open, onOpenChange, courseSection }) => {
  const { mutate: createAcademicInfo, isPending: isCreating } =
    useCreateAcademicInfo();
  const { mutate: updateAcademicInfo, isPending: isUpdating } =
    useUpdateAcademicInfo();
  const isEdit = !!courseSection;

  /** Backend filter state */
  const [filter, setFilter] = useState({
    year_level: "",
    course: "",
    section: "",
  });
  const { data = [], isLoading } = useAcademicInfoForm(filter);

  /** Normalize backend response */
  const dataList = Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
    ? data.results
    : Array.isArray(data?.data)
    ? data.data
    : [];

  /** React Hook Form */
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      year_level: isEdit ? courseSection.year_level : "",
      course: isEdit ? courseSection.course : "",
      section: isEdit ? courseSection.section : "",
    },
  });

  /** Autocomplete input states (typed values) */
  const [yearSearch, setYearSearch] = useState(
    isEdit ? courseSection.year_level : ""
  );
  const [courseSearch, setCourseSearch] = useState(
    isEdit ? courseSection.course : ""
  );
  const [sectionSearch, setSectionSearch] = useState(
    isEdit ? courseSection.section : ""
  );

  /** Sync RHF values with typed input */
  useEffect(() => setValue("year_level", yearSearch), [yearSearch, setValue]);
  useEffect(() => setValue("course", courseSearch), [courseSearch, setValue]);
  useEffect(
    () => setValue("section", sectionSearch),
    [sectionSearch, setValue]
  );

  useEffect(() => {
    if (courseSection) {
      // Edit mode: fill the form
      reset({
        year_level: courseSection.year_level || "",
        course: courseSection.course || "",
        section: courseSection.section || "",
      });
      setYearSearch(courseSection.year_level || "");
      setCourseSearch(courseSection.course || "");
      setSectionSearch(courseSection.section || "");
    } else {
      // Create mode: clear the form
      reset({
        year_level: "",
        course: "",
        section: "",
      });
      setYearSearch("");
      setCourseSearch("");
      setSectionSearch("");
    }
  }, [courseSection, reset]);

  /** Update backend filter */
  useEffect(
    () =>
      setFilter({
        year_level: yearSearch,
        course: courseSearch,
        section: sectionSearch,
      }),
    [yearSearch, courseSearch, sectionSearch]
  );

  /** Group items */
  const grouped = useMemo(() => {
    const years = new Set();
    const courses = new Set();
    const sections = new Set();

    dataList.forEach((item) => {
      if (item.year_level) years.add(item.year_level);
      if (item.course) courses.add(item.course);
      if (item.section) sections.add(item.section);
    });

    // Ensure edit values exist
    if (isEdit) {
      if (courseSection.year_level) years.add(courseSection.year_level);
      if (courseSection.course) courses.add(courseSection.course);
      if (courseSection.section) sections.add(courseSection.section);
    }

    return {
      year_level: [...years].map((y) => ({ value: y, label: y })),
      course: [...courses].map((c) => ({ value: c, label: c })),
      section: [...sections].map((s) => ({ value: s, label: s })),
    };
  }, [dataList, isEdit, courseSection]);

  const onSubmit = (formData) => {
    if (isEdit) {
      updateAcademicInfo(
        { id: courseSection.id, updatedAcademicInfo: formData },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createAcademicInfo(formData, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      icon={GraduationCap}
      title={isEdit ? "Edit Course & Section" : "Register Course & Section"}
      contentClassName="sm:max-w-[400px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-1">
        <input type="hidden" {...register("year_level")} />
        <input type="hidden" {...register("course")} />
        <input type="hidden" {...register("section")} />

        <div>
          <Label className="text-sm font-normal">Year Level</Label>
          <AutoComplete
            searchValue={yearSearch}
            onSearchValueChange={setYearSearch}
            items={grouped.year_level}
            isLoading={isLoading}
            placeholder="Select year level"
          />
        </div>

        <div>
          <Label className="text-sm font-normal">Course</Label>
          <AutoComplete
            searchValue={courseSearch}
            onSearchValueChange={setCourseSearch}
            items={grouped.course}
            isLoading={isLoading}
            placeholder="Select course"
          />
        </div>

        <div>
          <Label className="text-sm font-normal">Section</Label>
          <AutoComplete
            searchValue={sectionSearch}
            onSearchValueChange={setSectionSearch}
            items={grouped.section}
            isLoading={isLoading}
            placeholder="Select section"
          />
        </div>

        <div className="mt-4 w-full">
          <Button
            className="w-full"
            type="submit"
            disabled={isCreating || isUpdating}
          >
            {isEdit ? "Update" : "Register"}{" "}
            {isCreating || isUpdating ? "Processing..." : ""}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CourseSectionsModal;
