import React from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModal";
import SeasonModal from "@/components/modals/SeasonModal";

const LeagueDetailsHeader = ({ name, sport }) => {
  const { isOpen, openModal, closeModal } = useModal();
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
      <span className="font-medium text-sm row-start-2 md:text-lg">{name}</span>
      <Button onClick={openModal} className="ml-auto row-span-2 col-start-2 md:py-5">
        <Plus />
        New Season
      </Button>
      <SeasonModal
        isOpen={isOpen}
        onClose={closeModal}
        league={league}
        sport={sport}
      />
    </header>
  );
};

export default LeagueDetailsHeader;
