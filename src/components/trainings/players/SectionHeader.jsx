import React from "react";

const SectionHeader = ({ title, description, actionComponent }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      {actionComponent && <div>{actionComponent}</div>}
    </div>
  );
};

export default SectionHeader;
