import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GraduationCap, Plus } from "lucide-react";
import CourseSectionFilter from "./CourseSectionFilter";
import DataTable from "@/components/common/DataTable";
import CourseSectionTable from "./CourseSectionTable";
import { Button } from "@/components/ui/button";
import CourseSectionsModal from "./CourseSectionsModal";
import { useModal } from "@/hooks/useModal";
import { set } from "date-fns";
import CourseSectionDeleteModal from "./CourseSectionDeleteModal";

const CourseSectionsContainer = () => {
  const [selectedCourseSection, setSelectedCourseSection] = useState(null);
  const [filter, setFilter] = useState({
    search: "",
    year_level: null,
    course: null,
    section: null,
    exclude: null,
  });

  const modal = useModal();
  const deleteModal = useModal();

  const handleOpenModal = () => {
    setSelectedCourseSection(null);
    modal.openModal();
  };

  const handleUpdateModal = (courseSection) => {
    setSelectedCourseSection(courseSection);
    modal.openModal();
  };

  const handleCloseModal = () => {
    setSelectedCourseSection(null);
    modal.closeModal();
  };

  const handleOpenDeleteModal = (courseSection) => {
    setSelectedCourseSection(courseSection);
    deleteModal.openModal();
  };

  const handleCloseDeleteModal = () => {
    setSelectedCourseSection(null);
    deleteModal.closeModal();
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="flex flex-col border-b-2 border-primary/20 justify-between gap-4 pb-5 bg-transparent">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-3 rounded-xl">
              <GraduationCap className="size-7 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Course & Sections
                </h2>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                Register and manage year courses and sections for
                student-athletes.
              </p>
            </div>
          </div>
          <Button onClick={handleOpenModal}>
            <Plus /> Register Course & Section
          </Button>
        </div>
        <CourseSectionFilter filter={filter} setFilter={setFilter} />
      </CardHeader>
      <CardContent>
        <CourseSectionTable
          filter={filter}
          onUpdate={handleUpdateModal}
          onDelete={handleOpenDeleteModal}
        />
        <CourseSectionsModal
          open={modal.isOpen}
          onOpenChange={handleCloseModal}
          courseSection={selectedCourseSection}
        />
        <CourseSectionDeleteModal
          open={deleteModal.isOpen}
          onOpenChange={handleCloseDeleteModal}
          courseSection={selectedCourseSection}
        />
      </CardContent>
    </Card>
  );
};

export default CourseSectionsContainer;
