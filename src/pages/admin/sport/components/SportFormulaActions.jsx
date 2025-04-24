import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash, MoreHorizontal, SquarePen } from "lucide-react";

const SportFormulaActions = ({ modals, formula, setSelectedFormula }) => {
  const handleOpen = (modalType) => {
    setSelectedFormula(formula);
    modals[modalType]?.openModal();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleOpen("formula")}>
          <SquarePen className="mr-2 h-4 w-4" />
          Update Formula
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="text-destructive"
          onClick={() => handleOpen("delete")}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Formula
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SportFormulaActions;
