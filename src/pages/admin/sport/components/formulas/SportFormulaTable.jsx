import React from "react";
import DataTable from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, Plus } from "lucide-react";
import SportFormulaActions from "./SportFormulaActions";

const SportFormulaTable = ({ 
  formulas, 
  filter, 
  modals, 
  selectedFormula,
  setSelectedFormula,
  onEdit,
  onDelete,
  isLoading
}) => {
  const handleCreateFormula = () => {
    setSelectedFormula(null);
    modals.formula.openModal();
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Formula Name",
      cell: ({ getValue }) => (
        <div className="font-medium">{getValue()}</div>
      ),
    },
    {
      accessorKey: "expression",
      header: "Expression",
      cell: ({ getValue }) => (
        <div className="max-w-[400px] break-words font-mono text-xs bg-muted/30 p-1.5 rounded">
          {getValue() ? getValue() : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "is_ratio",
      header: "Type",
      cell: ({ row }) => (
        <div>
          <Badge variant={row.original.is_ratio ? "outline" : "secondary"} className="font-normal">
            {row.original.is_ratio ? "Ratio" : "Standard"}
          </Badge>
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "uses_point_value",
      header: "Uses Point Value",
      cell: ({ row }) => (
        <div>
          {row.original.uses_point_value ? 
            <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">Yes</Badge> : 
            <Badge variant="outline" className="text-muted-foreground">No</Badge>
          }
        </div>
      ),
      size: 150,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <SportFormulaActions
          formula={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
      size: 140,
    },
  ];

  return (
    <div className="border rounded-md overflow-hidden shadow-sm">
      <DataTable
        columns={columns}
        data={formulas || []}
        loading={isLoading}
        className="text-sm"
        pagination={false}
        unlimited={true}
        emptyMessage={
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Calculator className="h-8 w-8 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium mb-1">No formulas found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filter.search
                ? "Try adjusting your search to find formulas"
                : "Create your first formula to use in calculated stats"}
            </p>
            <Button
              onClick={handleCreateFormula}
              size="sm"
              className="bg-primary"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Formula
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default SportFormulaTable;
