import React from "react";
import { FolderIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const FolderCard = ({ folder, onClick }) => {
  return (
    <Card
      className="cursor-pointer border-primary/20 border-2 hover:shadow-lg transition-shadow duration-200 hover:border-primary"
      onClick={() => onClick(folder)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <FolderIcon className="h-10 w-10 text-primary" fill="maroon" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {folder.name}
            </h3>
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
              <span>{folder.subfolder_count || 0} folders</span>
              <span>•</span>
              <span>{folder.document_count || 0} files</span>
            </div>
            {folder.owner && (
              <p className="mt-1 text-xs text-gray-400">
                Owner: {folder.owner.first_name} {folder.owner.last_name}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FolderCard;
