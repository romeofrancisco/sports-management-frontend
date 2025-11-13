import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { GraduationCap, Plus } from "lucide-react";
import CourseSectionFilter from "./CourseSectionFilter";
import DataTable from "@/components/common/DataTable";
import CourseSectionTable from "./CourseSectionTable";
import { Button } from "@/components/ui/button";

const CourseSectionsContainer = () => {
  const [filter, setFilter] = useState({
    search: "",
    year_level: null,
    course: null,
    section: null,
    exclude: null,
  });

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
          <Button>
            <Plus /> Register Course & Section
          </Button>
        </div>
        <CourseSectionFilter filter={filter} setFilter={setFilter} />
      </CardHeader>
      <CardContent>
        <CourseSectionTable filter={filter} />
      </CardContent>
    </Card>
  );
};

export default CourseSectionsContainer;
