import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Trash, MoreHorizontal, ClipboardPenLine, SquarePen } from "lucide-react";

const TeamActions = ({ onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  
  const handleAction = (action) => {
    action();
    setOpen(false);
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
        <DropdownMenuItem onClick={() => handleAction(onView)}>
          <ClipboardPenLine className="mr-2 h-4 w-4" />
          View Team
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(onEdit)}>
          <SquarePen className="mr-2 h-4 w-4" />
          Update Team
        </DropdownMenuItem>
        <DropdownMenuItem 
          variant="destructive" 
          onClick={() => handleAction(onDelete)} 
          className="text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamActions;
