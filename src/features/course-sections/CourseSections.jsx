import React from "react";
import UniversityPageHeader from "@/components/common/UniversityPageHeader";
import CourseSectionsContainer from "./components/CourseSectionsContainer";

const CourseSections = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/2 to-secondary/2">
      <div className="container mx-auto p-1 md:p-6 space-y-6">
        <UniversityPageHeader
          title="Academic Information Management"
          description="Register and manage year, course, and section for student-athletes"
        />

        <CourseSectionsContainer />
      </div>
    </div>
  );
};

export default CourseSections;
