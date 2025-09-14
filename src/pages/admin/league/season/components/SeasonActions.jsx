import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  CheckSquare,
  XSquare,
  Settings,
  Share2,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useManageSeason } from "@/hooks/useSeasons";
import { useModal } from "@/hooks/useModal";
import { getStatusColor } from "@/utils/seasonUtils";
import GenerateBracketModal from "@/components/modals/GenerateBracketModal";
import SeasonModal from "@/components/modals/SeasonModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const SeasonActions = ({ season }) => {
  const { league } = useParams();
  const navigate = useNavigate();
  const { isOpen, closeModal, openModal } = useModal();
  const editModal = useModal();

  // State for action confirmation dialog
  const [confirmAction, setConfirmAction] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // State for dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Season management hooks
  const { mutate: manageSeason, isPending } = useManageSeason();

  if (!season) return null;

  const handleManageAction = (action) => {
    // Configure confirmation dialog based on action
    const actionConfig = {
      start: {
        title: "Start Season",
        description:
          "This will mark the season as ongoing. Games can now be scheduled and played.",
        icon: <Play className="h-6 w-6 text-red-600" />,
        confirmLabel: "Start Season",
      },
      pause: {
        title: "Pause Season",
        description:
          "This will temporarily pause the season. No new games can be played until it's resumed.",
        icon: <Pause className="h-6 w-6 text-amber-600" />,
        confirmLabel: "Pause Season",
      },
      complete: {
        title: "Complete Season",
        description:
          "This will mark the season as completed. The final standings will be calculated and no more games can be added.",
        icon: <CheckSquare className="h-6 w-6 text-amber-600" />,
        confirmLabel: "Complete Season",
      },
      cancel: {
        title: "Cancel Season",
        description:
          "This will cancel the season. All planned games will be marked as canceled and the season cannot be restarted.",
        icon: <XSquare className="h-6 w-6 text-red-600" />,
        confirmLabel: "Cancel Season",
      },
    };

    setConfirmAction(actionConfig[action]);
    setShowConfirm(true);
  };

  const confirmManageAction = (action) => {
    manageSeason(
      {
        league,
        season_id: season.id,
        action,
      },
      {
        onSuccess: () => {
          setShowConfirm(false);
        },
      }
    );
  };

  const canStart = season.status === "upcoming" || season.status === "paused";

  // Determine which actions are valid based on current status
  const isUpcoming = season.status === "upcoming";
  const isOngoing = season.status === "ongoing";
  const isPaused = season.status === "paused";
  const isCompleted = season.status === "completed";
  const isCanceled = season.status === "canceled";
  return (
    <>
      <div className="flex items-center gap-3">
        {/* Season actions based on status */}
        {isUpcoming && canStart && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleManageAction("start")}
            className="gap-2"
          >
            <Play size={15} />
            Start Season
          </Button>
        )}

        {isOngoing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleManageAction("pause")}
            className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <Pause size={15} />
            Pause Season
          </Button>
        )}

        {isPaused && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleManageAction("start")}
            className="gap-2 bg-red-800 hover:bg-red-900"
          >
            <Play size={15} />
            Resume Season
          </Button>
        )}

        {/* Settings Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Settings size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Season Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />{" "}
            {/* Modify season actions - Edit, Export */}
            <DropdownMenuItem
              className="flex items-center gap-2"
              onClick={() => {
                setDropdownOpen(false);
                editModal.openModal();
              }}
            >
              <Settings size={14} />
              <span>Edit Season</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Share2 size={14} />
              <span>Export Schedule</span>
            </DropdownMenuItem>{" "}
            {/* Generate Bracket moved to settings dropdown */}
            {!season.has_bracket && (
              <DropdownMenuItem
                className="flex items-center gap-2"
                onClick={() => {
                  setDropdownOpen(false);
                  openModal();
                }}
              >
                <Trophy size={14} />
                <span>Generate Bracket</span>
              </DropdownMenuItem>
            )}
            {/* Season status actions */}
            {(isOngoing || isPaused) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-amber-600"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleManageAction("complete");
                  }}
                >
                  <CheckSquare size={14} />
                  <span>Complete Season</span>
                </DropdownMenuItem>
              </>
            )}
            {(isUpcoming || isOngoing || isPaused) && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2 text-red-600"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleManageAction("cancel");
                  }}
                >
                  <XSquare size={14} />
                  <span>Cancel Season</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>{" "}
      {/* Generate Bracket Modal */}
      <GenerateBracketModal
        isOpen={isOpen}
        onClose={closeModal}
        season={season?.id}
        league={league}
        onSuccess={() => {
          // Navigate to bracket page after generation
          navigate(`/leagues/${league}/seasons/${season.id}/bracket`);
        }}
      />
      {/* Edit Season Modal */}
      <SeasonModal
        isOpen={editModal.isOpen}
        onClose={editModal.closeModal}
        season={season}
        sport={season?.league?.sport} // Pass sport data for the modal
      />
      {/* Confirmation Dialog for season management actions */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {confirmAction?.icon}
              {confirmAction?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => {
                // Extract action name from title
                const actionName = confirmAction?.title
                  .split(" ")[0]
                  .toLowerCase();
                confirmManageAction(actionName);
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                confirmAction?.confirmLabel
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SeasonActions;
