import React from "react";
import { Box } from "lucide-react";

const ContentEmpty = ({ 
  icon: Icon = Box, 
  title = "No content found", 
  description = "There are no items to display.", 
  action = null 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border rounded-lg bg-muted/10">
      <Icon className="h-12 w-12 text-muted-foreground/60 mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default ContentEmpty;