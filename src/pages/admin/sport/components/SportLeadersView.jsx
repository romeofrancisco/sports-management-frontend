import React from "react";
import LeaderCategoriesTable from "./LeaderCategoriesTable";
import { Card } from "@/components/ui/card";

const SportLeadersView = () => {
  return (
    <Card className="shadow-sm border rounded-lg overflow-hidden">
      <LeaderCategoriesTable />
    </Card>
  );
};

export default SportLeadersView;
