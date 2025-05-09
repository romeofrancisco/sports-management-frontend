import React, { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import DeleteFormulaModal from "@/components/modals/DeleteFormulaModal";
import FormulaModal from "@/components/modals/FormulaModal";
import { useModal } from "@/hooks/useModal";
import { useFormula } from "@/hooks/useFormula";
import { useParams } from "react-router";
import SportFormulaActions from "./SportFormulaActions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
        <div className="max-w-[400px] break-words text-sm text-muted-foreground">
          {getValue() ? getValue() : "N/A"}
        </div>
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
      size: 80,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Formula Management</h2>
        <Button onClick={handleCreateFormula}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Formula
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 max-w-md">
            <div>
              <Label htmlFor="search-formula">Search Formula</Label>
              <Input
                id="search-formula"
                placeholder="Search by formula name..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="border rounded-md overflow-hidden">
        <DataTable
          columns={columns}
          data={formula || []}
          loading={isFormulaLoading}
          className="text-sm"
          pagination={true}
          pageSize={8}
        />
      </div>
      
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
