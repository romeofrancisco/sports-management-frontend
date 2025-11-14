import React from "react";
import DeleteModal from "@/components/common/DeleteModal";
import { useDeleteAcademicInfo } from "@/hooks/useAcademicInfo";

const CourseSectionDeleteModal = ({ open, onOpenChange, courseSection }) => {
  const { mutate: deleteAcademicInfo, isPending: isDeleting } =
    useDeleteAcademicInfo();

  const handleConfirm = () => {
    deleteAcademicInfo(courseSection.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <DeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Are you sure you want to delete this academic info?"
      description={`This action cannot be undone. This will permanently delete the academic info for ${
        courseSection?.year_level
      } - ${courseSection?.course} ${
        courseSection?.section ? `- ${courseSection.section}` : ""
      }.`}
      contentClassName="sm:max-w-[700px]"
      onConfirm={handleConfirm}
    />
  );
};

export default CourseSectionDeleteModal;
