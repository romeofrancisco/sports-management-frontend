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
import { Trash, MoreHorizontal, Eye, Edit, Settings } from "lucide-react";

const TeamActions = ({ onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  
  const handleAction = (action) => {
    action();
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 p-0 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-card/95 backdrop-blur-sm border border-primary/20 shadow-xl"
      >
        <DropdownMenuLabel className="text-foreground font-semibold">
          Team Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-primary/20" /><DropdownMenuItem onClick={() => handleAction(onView)}>
          <Eye className="mr-2 h-4 w-4" />
          View Team
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(onEdit)}>
          <Edit className="mr-2 h-4 w-4" />
          Update Team
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleAction(onDelete)} 
          className="text-destructive focus:text-destructive focus:bg-destructive/10 hover:text-destructive hover:bg-destructive/10"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamActions;
