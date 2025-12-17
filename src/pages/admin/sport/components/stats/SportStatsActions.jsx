import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Trash, MoreHorizontal, SquarePen, RefreshCw } from "lucide-react";
import { useReactivateSportStat } from "@/hooks/useStats";
import { Badge } from "@/components/ui/badge";

const SportStatsActions = ({ modals, stat, setSelectedStat }) => {
  const reactivateMutation = useReactivateSportStat();

  const handleOpen = (modalType) => {
    setSelectedStat(stat);
    modals[modalType]?.openModal();
  };

  const handleReactivate = () => {
    reactivateMutation.mutate({ id: stat.id });
  };

  return (
    <div className="flex items-center gap-2">
      {!stat.is_active && (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 text-xs"
        >
          Inactive
        </Badge>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!stat.is_active ? (
            <DropdownMenuItem onClick={handleReactivate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reactivate Stat
            </DropdownMenuItem>
          ) : (
            <>
              <DropdownMenuItem onClick={() => handleOpen("stat")}>
                <SquarePen className="mr-2 h-4 w-4" />
                Update Stat
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="text-destructive"
                onClick={() => handleOpen("delete")}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Stat
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SportStatsActions;
