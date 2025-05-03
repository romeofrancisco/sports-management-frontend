import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, SquarePen, Trash } from "lucide-react";

const SportPositionActions = ({ modals, position, setSelectedPosition }) => {
  const [open, setOpen] = useState(false);
  
  const handleOpen = (modalType) => {
    setSelectedPosition(position);
    modals[modalType]?.openModal();
    setOpen(false); // Close dropdown when opening modal
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleOpen("update")}>
          <SquarePen className="mr-2 h-4 w-4" />
          Update Position
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          className="text-destructive"
          onClick={() => handleOpen("delete")}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Position
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SportPositionActions;
