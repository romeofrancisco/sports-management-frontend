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
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Calculator,
  Filter,
  X
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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

  const clearFilter = () => {
    setFilter({ search: "" });
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
      id: "actions",
      cell: ({ row }) => (
        <SportFormulaActions
          formula={row.original}
          modals={modals}
          setSelectedFormula={setSelectedFormula}
        />
      ),
      size: 100,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Formula Management
          </h2>
          <Badge variant="outline" className="bg-primary/10 font-medium">
            {formula?.length || 0} formulas
          </Badge>
        </div>
        
        <Button 
          onClick={handleCreateFormula} 
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white shadow-sm"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          New Formula
        </Button>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="py-3 px-4 bg-muted/20">
          <div className="text-base font-semibold">Search Formulas</div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex gap-4 items-end max-w-md">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-formula"
                placeholder="Search by formula name..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="pl-9 bg-background"
              />
            </div>
            {filter.search && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilter}
                className="flex items-center gap-1 h-9 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          {filter.search && (
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="secondary" className="flex items-center gap-1.5 bg-secondary/80 pl-2">
                <span>Search: {filter.search}</span>
                <button 
                  onClick={clearFilter}
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                  aria-label="Clear search filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              
              <div className="text-sm text-muted-foreground">
                Found {formula?.length || 0} matching formulas
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="border rounded-md overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={formula || []}
          loading={isFormulaLoading}
          className="text-sm"
          pagination={true}
          pageSize={8}
          alternateRowColors={true}
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
