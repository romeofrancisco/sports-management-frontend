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
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router";

const SportActions = ({ onEdit, onDelete, onReactivate, sport }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleAction = (action) => {
    action();
    setOpen(false);
  };

  const isActive = sport.is_active !== false; // Default to true if undefined

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
        {sport.requires_stats ? (
          <DropdownMenuItem
            onClick={() =>
              handleAction(() => navigate(`/sports/${sport.slug}`))
            }
          >
            <ClipboardPenLine className="mr-2 h-4 w-4" />
            Manage Sport
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem disabled>
            <ClipboardPenLine className="mr-2 h-4 w-4" />
            This sport does not require stats
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleAction(() => onEdit(sport))}>
          <SquarePen className="mr-2 h-4 w-4" />
          Update Sport
        </DropdownMenuItem>

        {/* Conditional rendering based on sport status */}
        {!isActive ? (
          // Show reactivate option for inactive sports
          <DropdownMenuItem
            onClick={() => handleAction(() => onReactivate(sport))}
            className="text-green-600 focus:text-green-600"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reactivate Sport
          </DropdownMenuItem>
        ) : (
          // Show delete option for active sports only
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleAction(() => onDelete(sport))}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Sport
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SportActions;
