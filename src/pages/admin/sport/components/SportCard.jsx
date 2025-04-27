import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import SportActions from "./SportActions";

const SportCard = ({ sport, onEdit, onDelete }) => {
  return (
    <Card className="aspect-video relative overflow-hidden group">
      <CardContent className="relative flex items-center justify-center h-full p-0">
        <h2 className="text-foreground text-lg font-semibold text-center px-2">
          {sport.name}
        </h2>
      </CardContent>
      <SportActions sport={sport} onDelete={onDelete} onEdit={onEdit} />
    </Card>
  );
};

export default SportCard;
