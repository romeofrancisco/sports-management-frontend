import React from "react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Empty state component
 * Displays a message when no data is available
 */
export const EmptyState = ({ message }) => (
  <Card className="w-full">
    <CardContent className="flex justify-center items-center py-12">
      <div className="text-center">
        <p className="text-muted-foreground">{message}</p>
      </div>
    </CardContent>
  </Card>
);
