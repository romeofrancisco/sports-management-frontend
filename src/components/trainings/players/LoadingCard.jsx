import React from "react";
import { Card } from "@/components/ui/card";
import ContentLoading from "@/components/common/ContentLoading";

const LoadingCard = () => {
  return (
    <Card className="border shadow-sm overflow-hidden">
      <div className="p-8 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-4">
          <ContentLoading />
        </div>
        <div className="w-full max-w-md space-y-3">
          <div className="h-2 bg-muted rounded w-full"></div>
          <div className="h-2 bg-muted rounded w-4/5"></div>
          <div className="h-2 bg-muted rounded w-3/5"></div>
        </div>
      </div>
    </Card>
  );
};

export default LoadingCard;
