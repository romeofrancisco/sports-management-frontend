import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { Trash, UserPen, UserSearch, MoreHorizontal, RotateCcw } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  
  const CoachActions = ({ coach, onDelete, onUpdate, onReactivate }) => {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleViewCoach = () => {
      setDropdownOpen(false);
      navigate(`/coaches/${coach.id}`);
    };

    const handleUpdate = () => {
      setDropdownOpen(false);
      onUpdate(coach);
    };

    const handleDelete = () => {
      setDropdownOpen(false);
      onDelete(coach);
    };

    const handleReactivate = () => {
      setDropdownOpen(false);
      onReactivate(coach);
    };

    return (
      <div data-actions>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel className="text-xs md:text-sm">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-xs md:text-sm"
              onClick={handleViewCoach}
            >
              <UserSearch className="mr-2 h-4 w-4" />
              View Coach
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-xs md:text-sm"
              onClick={handleUpdate}
            >
              <UserPen className="mr-2 h-4 w-4" />
              Update Coach
            </DropdownMenuItem>
            {coach.is_active ? (
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive text-xs md:text-sm"
              >
                <Trash className="mr-2 h-4 w-4 text-destructive" />
                Delete Coach
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={handleReactivate}
                className="text-green-600 dark:text-green-400 text-xs md:text-sm"
              >
                <RotateCcw className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                Reactivate Coach
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  
  export default CoachActions;
  