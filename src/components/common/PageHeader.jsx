import React from "react";

const PageHeader = ({ title, description, actionComponent }) => {
  return (
    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row sm:justify-between sm:items-center">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          {description}
        </p>
      </div>
      {actionComponent && (
        <div className="flex-shrink-0 w-full sm:w-auto">
          {actionComponent}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
