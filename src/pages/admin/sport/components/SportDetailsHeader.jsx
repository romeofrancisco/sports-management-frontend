import React from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";

const SportDetailsHeader = () => {
  const { sport } = useParams();
  
  // Capitalize first letter of sport name
  const capitalizedSport = sport ? sport[0].toUpperCase() + sport.slice(1) : '';
  
  return (
    <header className="bg-background border-b sticky top-0 z-10 w-full">
      <div className="container mx-auto py-4 px-4 sm:px-6">
        <div className="flex flex-col space-y-2">
          <Link
            to="/sports"
            className="flex items-center text-muted-foreground hover:text-primary transition-colors text-sm w-fit"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Sports
          </Link>
          
          <h1 className="font-semibold text-xl md:text-2xl">
            Manage {capitalizedSport}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default SportDetailsHeader;
