import React, { useState } from "react";
import SportFormulaTable from "./SportFormulaTable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Plus } from "lucide-react";
import { useFormula } from "@/hooks/useFormula";
import { useParams } from "react-router";
import { useModal } from "@/hooks/useModal";
import FormulaModal from "@/components/modals/FormulaModal";
import DeleteFormulaModal from "@/components/modals/DeleteFormulaModal";

const SportFormulasView = () => {
  const { sport } = useParams();
  const [filter, setFilter] = useState({ search: "" });
  const [selectedFormula, setSelectedFormula] = useState(null);
  
  const { data: formulas, isLoading } = useFormula(sport, filter);
  const filteredFormulas = formulas || [];

  const modals = {
    formula: useModal(),
    delete: useModal(),
  };

  const handleCreateFormula = () => {
    setSelectedFormula(null);
    modals.formula.openModal();
  };

  const handleEditFormula = (formula) => {
    setSelectedFormula(formula);
    modals.formula.openModal();
  };

  const handleDeleteFormula = (formula) => {
    setSelectedFormula(formula);
    modals.delete.openModal();
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            Formulas
          </h2>
          <Badge variant="outline" className="bg-primary/10 text-primary w-fit">
            {filteredFormulas.length} formulas
          </Badge>
        </div>
        <Button 
          onClick={handleCreateFormula}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4" />
          New Formula
        </Button>
      </div>

      {/* Content Section */}
      <div className="bg-background">
        <Card className="shadow-sm border rounded-lg overflow-hidden">
          <SportFormulaTable 
            formulas={filteredFormulas}
            filter={filter}
            modals={modals}
            selectedFormula={selectedFormula}
            setSelectedFormula={setSelectedFormula}
            onEdit={handleEditFormula}
            onDelete={handleDeleteFormula}
            isLoading={isLoading}
          />
        </Card>
      </div>

      {/* Modals */}
      <FormulaModal
        isOpen={modals.formula.isOpen}
        onClose={modals.formula.closeModal}
        formula={selectedFormula}
      />
      <DeleteFormulaModal
        isOpen={modals.delete.isOpen}
        onClose={modals.delete.closeModal}
        formula={selectedFormula}
      />
    </div>
  );
};

export default SportFormulasView;
