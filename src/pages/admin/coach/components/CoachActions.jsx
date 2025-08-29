import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  import { Trash, UserPen, UserSearch, MoreHorizontal } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  
  const CoachActions = ({ coach, onDelete, onUpdate }) => {
    const navigate = useNavigate();

    const handleViewCoach = () => {
      navigate(`/coaches/${coach.id}`);
    };

    return (
      <div data-actions>
        <DropdownMenu>
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
              onClick={() => onUpdate(coach)}
            >
              <UserPen className="mr-2 h-4 w-4" />
              Update Coach
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(coach)}
              className="text-destructive text-xs md:text-sm"
            >
              <Trash className="mr-2 h-4 w-4 text-destructive" />
              Delete Coach
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };
  
  export default CoachActions;
  