import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import DeleteFormulaModal from "@/components/modals/DeleteFormulaModal";
import FormulaModal from "@/components/modals/FormulaModal";
import { useModal } from "@/hooks/useModal";
import { useFormula } from "@/hooks/useFormula";
import { useParams } from "react-router";
import SportFormulaActions from "./SportFormulaActions";
import { SearchFilter } from "@/components/common/Filters";

const SportFormulaTable = () => {
  const { sport } = useParams();
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [filter, setFilter] = useState({ search: "" });
  const { data: formula, isLoading: isFormulaLoading } = useFormula(
    sport,
    filter
  );

  const modals = {
    formula: useModal(),
    delete: useModal(),
  };

  const handleCreateFormula = () => {
    setSelectedFormula(null);
    modals.formula.openModal();
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Formula Name",
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: "expression",
      header: "Expression",
      cell: ({ getValue }) => (
        <span className="whitespace-normal break-words text-xs text-muted-foreground">{getValue()}</span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <SportFormulaActions
          formula={row.original}
          modals={modals}
          setSelectedFormula={setSelectedFormula}
        />
      ),
      size: 50
    },
  ];

  return (
    <div className="px-5 md:border md:bg-muted/30 md:p-5 lg:p-8 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl semibold">Formulas</h1>
        <Button onClick={handleCreateFormula}>Create New Formula</Button>
      </div>
      <SearchFilter
        value={filter.search}
        onChange={(search) => setFilter((prev) => ({ ...prev, search }))}
      />
      <DataTable
        columns={columns}
        data={formula || []}
        loading={isFormulaLoading}
        className="text-xs md:text-sm"
      />
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

export default SportFormulaTable;
