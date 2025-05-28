import React from "react";
import SportsListHeader from "./components/SportsListHeader";
import SportsContainer from "./components/SportsContainer";

const SportsList = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <SportsListHeader />
      <SportsContainer/>
    </div>
  );
};

export default SportsList;
