import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileTextIcon } from "lucide-react";

export const ViewResultButton = ({ game }) => {
  const navigate = useNavigate();

  const handleResultClick = () => {
    navigate(`/games/${game.id}/game-result`);
  };

  return (
    <div className="flex justify-center pt-4 border-t border-primary/10">
      <Button 
        onClick={handleResultClick}
        variant="outline" 
        size="sm"
        className="border-primary/50 text-primary/70 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all duration-300"
      >
        <FileTextIcon className="mr-2 h-4 w-4" />
        View Game Result
      </Button>
    </div>
  );
};

export default ViewResultButton;
