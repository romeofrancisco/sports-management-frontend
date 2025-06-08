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
import {
  Trash,
  MoreHorizontal,
  ClipboardPenLine,
  SquarePen,
} from "lucide-react";
import { useNavigate } from "react-router";

const SportActions = ({ onEdit, onDelete, sport }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  
  const handleAction = (action) => {
    action();
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 absolute right-4 -top-2"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction(() => navigate(`/sports/${sport.slug}`))}>
          <ClipboardPenLine className="mr-2 h-4 w-4" />
          Manage Sport
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(() => onEdit(sport))}>
          <SquarePen className="mr-2 h-4 w-4" />
          Update Sport
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => handleAction(() => onDelete(sport))}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Sport
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SportActions;
