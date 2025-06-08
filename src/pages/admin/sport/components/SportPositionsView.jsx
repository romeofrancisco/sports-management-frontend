import React from "react";
import SportPositionsTable from "./SportPositionsTable";
import { Card } from "@/components/ui/card";

const SportPositionsView = () => {
  return (
    <Card className="shadow-sm border rounded-lg overflow-hidden">
      <SportPositionsTable />
    </Card>
  );
};

export default SportPositionsView;
