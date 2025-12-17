import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, RefreshCw } from "lucide-react";
import { useReactivateFormula } from "@/hooks/useFormula";
import { cn } from "@/lib/utils";

const SportFormulaActions = ({ formula, onEdit, onDelete }) => {
  const reactivateMutation = useReactivateFormula();

  const handleReactivate = () => {
    reactivateMutation.mutate({ id: formula.id });
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      {!formula.is_active && (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 text-xs"
        >
          Inactive
        </Badge>
      )}
      {!formula.is_active ? (
        <Button
          variant="default"
          size="sm"
          onClick={handleReactivate}
          disabled={reactivateMutation.isPending}
          className="h-8 px-3 bg-green-600 hover:bg-green-700"
        >
          <RefreshCw className={cn("h-3 w-3 mr-1", reactivateMutation.isPending && "animate-spin")} />
          Reactivate
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(formula)}
            className="h-8 px-3"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(formula)}
            className="h-8 px-3"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default SportFormulaActions;
