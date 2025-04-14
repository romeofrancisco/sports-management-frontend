import React from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerateBracketModal from "@/components/modals/GenerateBracketModal";
import { useModal } from "@/hooks/useModal";
import { useNavigate } from "react-router";

const SeasonDetailsHeader = ({ season }) => {
  const { isOpen, closeModal, openModal } = useModal();
  const navigate = useNavigate();
  const { league } = useParams();
  return (
    <header className="border-b p-4 mb-4 grid grid-cols-2 grid-rows-2 items-center">
      <Link
        to="/leagues"
        className="flex text-muted-foreground text-xs max-w-[8.5rem]"
      >
        <ChevronLeft size={18} />
        Back to Leagues
      </Link>
      <span className="font-medium text-sm row-start-2 md:text-lg">{season.name}</span>
      <div className="ml-auto row-span-2 se">
        {season?.has_bracket ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/leagues/${league}/bracket/${season?.id}`)}
            className="ml-auto row-span-2 col-start-2 md:py-5"
          >
            View Bracket
          </Button>
        ) : (
          <Button
            variant="outline"
            className="ml-auto row-span-2 col-start-2 md:py-5"
            size="sm"
            onClick={openModal}
          >
            Generate Bracket
          </Button>
        )}
        <GenerateBracketModal
          isOpen={isOpen}
          onClose={closeModal}
          season={season?.id}
          league={league}
        />
      </div>
    </header>
  );
};

export default SeasonDetailsHeader;
