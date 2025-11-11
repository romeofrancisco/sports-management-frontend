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
import { Input } from "@/components/ui/input";
import FilterDropdown from "@/components/common/FilterDropdown";
import ControlledSelect from "@/components/common/ControlledSelect";
import { useStatCategories } from "@/hooks/useStats";
import {
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

const SportFormulasView = () => {
  const { sport } = useParams();
  const [filter, setFilter] = useState({ search: "", category: null });
  const [selectedFormula, setSelectedFormula] = useState(null);

  const { data: formulas, isLoading } = useFormula(sport, filter);
  const filteredFormulas = formulas || [];

  // Load categories for the sport to populate the filter select
  const { data: categories } = useStatCategories({ sport });

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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex lg:flex-row flex-col space-y-4 lg:space-y-0">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg border border-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <Calculator className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xl font-bold">Formulas</span>

                <span className="text-muted-foreground line-clamp-1 text-sm">
                  Manage custom statistical formulas for {sport || "this sport"}
                  .
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={handleCreateFormula}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            New Formula
          </Button>
        </div>
        <div>
          <div className="flex gap-2">
            <Input
              placeholder="Search formulas..."
              value={filter.search}
              onChange={(e) =>
                setFilter((s) => ({ ...s, search: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

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
