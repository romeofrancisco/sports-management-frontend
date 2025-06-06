import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Calendar,
  Trophy,
  Users,
  Goal,
  Settings,
  Share2,
  Play,
  Pause,
  CheckSquare,
  XSquare,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import GenerateBracketModal from "@/components/modals/GenerateBracketModal";
import { useModal } from "@/hooks/useModal";
import { Badge } from "@/components/ui/badge";
import { useManageSeason } from "@/hooks/useSeasons";
import { getStatusColor, formatDate } from "@/utils/seasonUtils";
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

const SeasonDetailsHeader = ({ season, setActiveTab }) => {
  const { isOpen, closeModal, openModal } = useModal();
  const { league } = useParams();

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
      }    );
  };

  // Get current date to check if season can be started
  const currentDate = new Date();
  const startDate = season.start_date ? new Date(season.start_date) : null;
  const canStart =
    season.status === "upcoming" &&
    startDate &&
    currentDate.toDateString() === startDate.toDateString();

  // Determine which actions are valid based on current status
  const isUpcoming = season.status === "upcoming";
  const isOngoing = season.status === "ongoing";
  const isPaused = season.status === "paused";
  const isCompleted = season.status === "completed";
  const isCanceled = season.status === "canceled";

  return (
    <>
      <div className="bg-muted/50 rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">
                    {season.name || "Season"}
                  </h1>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getStatusColor(season.status)}`}
                  >
                    {season.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={15} />
                    <span>{season.year || "Year"}</span>
                  </div>

                  {season.start_date && (
                    <div className="flex items-center">
                      <span>{formatDate(season.start_date)}</span>
                      {season.end_date && (
                        <>
                          <span className="mx-1">—</span>
                          <span>{formatDate(season.end_date)}</span>
                        </>
                      )}
                    </div>
                  )}

                  {season.teams_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Users size={15} />
                      <span>{season.teams_count} teams</span>
                    </div>
                  )}

                  {season.games_count > 0 && (
                    <div className="flex items-center gap-1">
                      <Goal size={15} />
                      <span>
                        {season.games_played || 0}/{season.games_count} games
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 self-start">
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

              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                    <Settings size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Season Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Modify season actions - Edit, Export */}
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Settings size={14} />
                    <span>Edit Season</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-2">
                    <Share2 size={14} />
                    <span>Export Schedule</span>
                  </DropdownMenuItem>

                  {/* Generate Bracket moved to settings dropdown */}
                  {!season.has_bracket && (
                    <DropdownMenuItem
                      className="flex items-center gap-2"
                      onClick={openModal}
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
                        onClick={() => handleManageAction("complete")}
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
                        onClick={() => handleManageAction("cancel")}
                      >
                        <XSquare size={14} />
                        <span>Cancel Season</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <GenerateBracketModal
          isOpen={isOpen}
          onClose={closeModal}
          season={season?.id}
          league={league}
          setActiveTab={setActiveTab}
        />
      </div>

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

export default SeasonDetailsHeader;
