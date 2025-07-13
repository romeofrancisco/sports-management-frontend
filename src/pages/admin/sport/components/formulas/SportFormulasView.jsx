import React from "react";
import SportFormulaTable from "./SportFormulaTable";
import { Card } from "@/components/ui/card";

const SportFormulasView = () => {
  return (
    <Card className="shadow-sm border rounded-lg overflow-hidden">
      <SportFormulaTable />
    </Card>
  );
};

export default SportFormulasView;
