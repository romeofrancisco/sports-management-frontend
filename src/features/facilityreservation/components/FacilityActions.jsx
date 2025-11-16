import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

const FacilityActions = ({ facility, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Facility actions"
          className="bg-muted/50 border-0"
        >
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem
          disabled={!facility}
          onClick={() => {
            onEdit && onEdit(facility);
          }}
        >
          <div className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            <span>Edit Facility</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={!facility}
          className="text-destructive"
          onClick={() => {
            onDelete && onDelete(facility);
          }}
        >
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Delete Facility</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FacilityActions;
