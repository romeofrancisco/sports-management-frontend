import React from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const SportDetailsHeader = () => {
  const { sport } = useParams();
  return (
    <header className="border-b p-4 grid grid-cols-2 grid-rows-2 items-center">
      <Link
        to="/"
        className="flex text-muted-foreground text-xs max-w-[8.5rem]"
      >
        <ChevronLeft size={18} />
        Back to Sports
      </Link>
      <span className="font-medium text-sm row-start-2 md:text-lg">
        Manage {sport[0].toUpperCase() + sport.slice(1)}
      </span>
    </header>
  );
};

export default SportDetailsHeader;
