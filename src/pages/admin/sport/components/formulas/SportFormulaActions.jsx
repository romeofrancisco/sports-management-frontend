import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

const SportFormulaActions = ({ formula, onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-end space-x-2">
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
    </div>
  );
};

export default SportFormulaActions;
