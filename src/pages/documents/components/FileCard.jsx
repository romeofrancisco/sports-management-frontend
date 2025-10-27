import React from "react";
import { FileTextIcon, DownloadIcon, CopyIcon, Trash2Icon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const FileCard = ({ file, onDownload, onCopy, onDelete, canEdit, canDelete }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <FileTextIcon className="h-10 w-10 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {file.title}
              </h3>
              {file.description && (
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {file.description}
                </p>
              )}
              <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
                <span>{formatFileSize(file.file_size)}</span>
                <span>•</span>
                <span>{formatDate(file.uploaded_at)}</span>
                {file.status === "copy" && (
                  <>
                    <span>•</span>
                    <span className="text-orange-500">Copy</span>
                  </>
                )}
              </div>
              {file.uploaded_by && (
                <p className="mt-1 text-xs text-gray-400">
                  By: {file.uploaded_by.first_name} {file.uploaded_by.last_name}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownload(file)}>
                <DownloadIcon className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              {file.status !== "copy" && (
                <DropdownMenuItem onClick={() => onCopy(file)}>
                  <CopyIcon className="mr-2 h-4 w-4" />
                  Copy to My Folder
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(file)}
                  variant="destructive"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileCard;
