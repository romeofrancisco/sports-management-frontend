import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, Plus, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useAddTeamToTournament,
  useRemoveTeamFromTournament,
  useTournamentTeamForm,
} from "@/hooks/useTournaments";
import { useSportTeams } from "@/hooks/useTeams";
import Modal from "@/components/common/Modal";
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
import { toast } from "sonner";

const TournamentTeams = ({ tournament }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [teamToRemove, setTeamToRemove] = useState(null);
  const [selectedTeamsToAdd, setSelectedTeamsToAdd] = useState([]);

  const sport = tournament?.sport?.slug;
  const division = tournament?.division;
  const teams = tournament?.teams || [];
  const has_bracket = tournament?.has_bracket;

  // Get team form data
  const { data: teamFormData } = useTournamentTeamForm(tournament?.id);
  const { data: allTeams, isLoading: isLoadingAllTeams } = useSportTeams(
    sport,
    division
  );

  // Create a map of team form data for easy lookup
  const formDataMap = {};
  if (teamFormData) {
    teamFormData.forEach((teamData) => {
      formDataMap[teamData.team_id] = {
        form: teamData.form || [],
        wins: teamData.wins || 0,
        losses: teamData.losses || 0,
        draws: teamData.draws || 0,
        win_ratio: teamData.win_ratio || 0,
        match_points: teamData.match_points || 0,
        point_differential: teamData.point_differential || 0,
      };
    });
  }

  const { mutate: addTeam, isPending: isAdding } = useAddTeamToTournament();
  const { mutate: removeTeam, isPending: isRemoving } =
    useRemoveTeamFromTournament();

  // Pre-select teams that are already in the tournament when modal opens
  useEffect(() => {
    if (isAddDialogOpen && teams.length > 0) {
      setSelectedTeamsToAdd(teams.map((t) => t.id));
    }
  }, [isAddDialogOpen, teams]);

  const handleAddSelectedTeams = async () => {
    if (selectedTeamsToAdd.length === 0) {
      toast.error("Please select at least one team", { richColors: true });
      return;
    }

    // Filter teams to add (selected but not in tournament)
    const existingTeamIds = teams.map((t) => t.id);
    const teamsToAdd = selectedTeamsToAdd.filter(
      (teamId) => !existingTeamIds.includes(teamId)
    );

    // Filter teams to remove (in tournament but not selected)
    const teamsToRemove = existingTeamIds.filter(
      (teamId) => !selectedTeamsToAdd.includes(teamId)
    );

    const totalOperations = teamsToAdd.length + teamsToRemove.length;

    if (totalOperations === 0) {
      toast.info("No changes to make", { richColors: true });
      return;
    }

    try {
      const promises = [];

      // Add new teams
      teamsToAdd.forEach((teamId) => {
        promises.push(
          new Promise((resolve) => {
            addTeam(
              { tournamentId: tournament.id, teamId },
              {
                onSuccess: () => {
                  console.log("Team added successfully:", teamId);
                  resolve({ success: true });
                },
                onError: (error) => {
                  console.log("Team add failed:", teamId, error);
                  resolve({ success: false });
                },
              }
            );
          })
        );
      });

      // Remove unchecked teams
      teamsToRemove.forEach((teamId) => {
        promises.push(
          new Promise((resolve) => {
            removeTeam(
              { tournamentId: tournament.id, teamId },
              {
                onSuccess: () => {
                  console.log("Team removed successfully:", teamId);
                  resolve({ success: true });
                },
                onError: (error) => {
                  console.log("Team remove failed:", teamId, error);
                  resolve({ success: false });
                },
              }
            );
          })
        );
      });

      // Wait for all operations to complete
      const results = await Promise.all(promises);
      console.log("All operations complete. Results:", results);

      const successCount = results.filter((r) => r.success).length;
      const errorCount = results.filter((r) => !r.success).length;
      const addedCount = teamsToAdd.length;
      const removedCount = teamsToRemove.length;

      console.log("Counts:", {
        successCount,
        errorCount,
        addedCount,
        removedCount,
      });

      // Close modal and clear selection first
      setSelectedTeamsToAdd([]);
      setIsAddDialogOpen(false);

      // Show single consolidated toast after a small delay
      setTimeout(() => {
        if (errorCount === 0) {
          // All operations succeeded
          if (addedCount > 0 && removedCount > 0) {
            toast.success(
              `Added ${addedCount} and removed ${removedCount} ${
                addedCount + removedCount === 1 ? "team" : "teams"
              }`,
              { richColors: true }
            );
          } else if (addedCount > 0) {
            toast.success(
              `Successfully added ${addedCount} ${
                addedCount === 1 ? "team" : "teams"
              }`,
              { richColors: true }
            );
          } else {
            toast.success(
              `Successfully removed ${removedCount} ${
                removedCount === 1 ? "team" : "teams"
              }`,
              { richColors: true }
            );
          }
        } else if (successCount > 0) {
          // Some succeeded, some failed
          toast.warning(
            `Updated ${successCount} ${
              successCount === 1 ? "team" : "teams"
            }, but ${errorCount} failed`,
            { richColors: true }
          );
        } else {
          // All failed
          toast.error("Failed to update teams", { richColors: true });
        }
      }, 100);
    } catch (error) {
      console.error("Error in handleAddSelectedTeams:", error);
      toast.error("An unexpected error occurred", { richColors: true });
    }
  };

  const handleToggleAllTeams = (checked) => {
    setSelectedTeamsToAdd(checked ? allTeams?.map((t) => t.id) || [] : []);
  };

  const handleToggleTeam = (checked, id) => {
    setSelectedTeamsToAdd((prev) =>
      checked ? [...prev, id] : prev.filter((teamId) => teamId !== id)
    );
  };

  const handleRemoveTeam = () => {
    if (!teamToRemove) return;

    removeTeam(
      { tournamentId: tournament.id, teamId: teamToRemove.id },
      {
        onSuccess: () => {
          toast.success("Team removed successfully");
          setTeamToRemove(null);
        },
        onError: (error) => {
          toast.error("Failed to remove team", {
            description: error.message,
          });
        },
      }
    );
  };

  // Loading state
  const isLoading = !tournament || isLoadingAllTeams;

  // Early return for undefined tournament
  if (!tournament) {
    return (
      <div className="animate-in fade-in-50 duration-500">
        <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-2 border-border/40 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="absolute -bottom-1 -right-2 w-5 h-5 rounded-full" />
                      </div>
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="border-t border-border/40 pt-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-3 w-8" />
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <Skeleton className="h-3 w-10" />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Skeleton
                              key={j}
                              className="w-2 h-2 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (teams?.length === 0 && !isLoading) {
    return (
      <div className="animate-in fade-in-50 duration-500">
        <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                    Tournament Teams
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Teams participating in this tournament
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Team
              </Button>
            </div>
          </CardHeader>

          <CardContent className="relative px-6">
            <Card className="border-2 border-dashed border-muted-foreground/25 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-base sm:text-lg font-medium mb-4">
                  No teams in this tournament yet
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus />
                  Add Your First Team
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="bg-gradient-to-br from-card via-card to-card/95 shadow-xl border-2 border-primary/20 transition-all duration-300 hover:shadow-2xl hover:border-primary/30 relative overflow-hidden">
        {/* Enhanced background effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>

        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-110">
                <Users className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-gradient">
                  Tournament Teams
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {teams.length} {teams.length === 1 ? "team" : "teams"}{" "}
                  participating in this tournament
                </p>
              </div>
            </div>
            {!has_bracket && (
              <Button
                size="sm"
                className="gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Team
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative px-6">
          {isLoading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card
                  key={i}
                  className="overflow-hidden border-2 border-border/40 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 animate-pulse"
                >
                  <CardContent className="p-4">
                    {/* Main Team Info Skeleton */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="absolute -bottom-1 -right-2 w-5 h-5 rounded-full" />
                      </div>
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>

                    {/* Stats Section Skeleton */}
                    <div className="border-t border-border/40 pt-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-3 w-8" />
                      </div>

                      {/* Form Indicator Skeleton */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <Skeleton className="h-3 w-10" />
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Skeleton
                              key={j}
                              className="w-2 h-2 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Actual Team Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(teamFormData && teamFormData.length > 0
                ? teamFormData
                : teams
              ).map((teamOrData, index) => {
                // If we have teamFormData, use it (already sorted by standings)
                // Otherwise fall back to teams array
                const team =
                  teamFormData && teamFormData.length > 0
                    ? teams.find((t) => t.id === teamOrData.team_id)
                    : teamOrData;

                if (!team) return null;

                const teamStats = formDataMap[team.id] || {
                  form: [],
                  wins: 0,
                  losses: 0,
                  draws: 0,
                  win_ratio: 0,
                  match_points: 0,
                  point_differential: 0,
                };

                return (
                  <Card
                    key={team.id}
                    className="overflow-hidden border-2 transition-all duration-300 hover:shadow-lg group bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20 relative"
                  >
                    {!has_bracket && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 z-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setTeamToRemove(team)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    <CardContent className="p-4">
                      {/* Main Team Info */}
                      <div className="flex items-center gap-3 mb-3">
                        {/* Position Badge */}
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-primary/80 to-primary/90 text-primary-foreground font-bold text-sm shadow-sm">
                            #{index + 1}
                          </div>
                          <div className="absolute -bottom-1 -right-2 w-5 h-5 rounded-full bg-background border-2 border-background flex items-center justify-center">
                            <Trophy className="h-3 w-3 text-primary" />
                          </div>
                        </div>

                        {/* Team Logo */}
                        <div className="relative">
                          <Avatar className="w-12 h-12 border-2 border-primary/20 shadow-sm group-hover:border-primary/40 transition-colors">
                            <AvatarImage
                              src={team.logo}
                              alt={team.name}
                              className="object-contain"
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                              {team.name?.charAt(0) || "T"}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Team Name and Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {team.name}
                            </h3>
                            <div
                              className={`text-xs font-bold ${
                                teamStats.win_ratio !== undefined
                                  ? teamStats.win_ratio >= 0.7
                                    ? "text-green-700 dark:text-green-400"
                                    : teamStats.win_ratio >= 0.5
                                    ? "text-yellow-700 dark:text-yellow-400"
                                    : teamStats.win_ratio >= 0.3
                                    ? "text-orange-700 dark:text-orange-400"
                                    : "text-red-700 dark:text-red-400"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {teamStats.win_ratio !== undefined
                                ? `${Math.round(teamStats.win_ratio * 100)}%`
                                : "0%"}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 text-xs">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Trophy className="h-3 w-3" />
                                {teamStats.wins !== undefined &&
                                teamStats.losses !== undefined
                                  ? `${teamStats.wins}W-${teamStats.losses}L`
                                  : "0W-0L"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form Indicator - Always Show */}
                      <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                        <span className="text-xs text-muted-foreground font-medium">
                          Form:
                        </span>
                        <div className="flex items-center gap-1">
                          {teamStats.form.length > 0 ? (
                            teamStats.form
                              .slice(0, 5)
                              .map((result, idx) => (
                                <div
                                  key={idx}
                                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    result === "W"
                                      ? "bg-green-500 shadow-sm hover:bg-green-600"
                                      : result === "L"
                                      ? "bg-red-500 shadow-sm hover:bg-red-600"
                                      : result === "D"
                                      ? "bg-yellow-500 shadow-sm hover:bg-yellow-600"
                                      : "bg-gray-300"
                                  }`}
                                  title={
                                    result === "W"
                                      ? "Win"
                                      : result === "L"
                                      ? "Loss"
                                      : result === "D"
                                      ? "Draw"
                                      : "Unknown"
                                  }
                                />
                              ))
                          ) : (
                            <>
                              {[...Array(5)].map((_, idx) => (
                                <div
                                  key={idx}
                                  className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700"
                                  title="No games played"
                                />
                              ))}
                              <span className="text-xs text-muted-foreground/70 italic ml-2">
                                No games yet
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Team Modal */}
      <Modal
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            setSelectedTeamsToAdd([]);
          }
        }}
        maxHeight="90vh"
        title="Add Team to Tournament"
        description="Select teams to add to this tournament"
        icon={Users}
        size="lg"
      >
        <div className="space-y-4">
          {!allTeams || allTeams.length === 0 ? (
            <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-8">
              <p className="text-center text-muted-foreground">
                No available teams to add
              </p>
            </div>
          ) : (
            <>
              {/* Team Selection Component */}
              <div className="rounded-xl bg-card/70 ">
                <div className="flex items-center gap-2 mb-3 border-b pb-2">
                  <Checkbox
                    checked={
                      allTeams &&
                      allTeams.length > 0 &&
                      selectedTeamsToAdd.length === allTeams.length
                    }
                    onCheckedChange={handleToggleAllTeams}
                  />
                  <Label className="text-sm font-semibold">
                    Select All Teams
                  </Label>
                  {selectedTeamsToAdd.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {selectedTeamsToAdd.length} selected
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allTeams?.map((team) => {
                    const isSelected = selectedTeamsToAdd.includes(team.id);
                    return (
                      <div
                        key={team.id}
                        className={`flex items-center gap-2 p-3 rounded-lg transition-all border hover:border-primary/40 bg-background/60 ${
                          isSelected
                            ? "border-primary/60 bg-primary/5"
                            : "border-border"
                        } cursor-pointer`}
                        onClick={(e) => {
                          // Prevent double toggle if checkbox is clicked
                          if (e.target.closest('[role="checkbox"]')) return;
                          handleToggleTeam(!isSelected, team.id);
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleToggleTeam(checked, team.id)
                          }
                        />
                        <Avatar className="w-10 h-10 border border-primary/20">
                          <AvatarImage src={team.logo} alt={team.name} />
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            {team.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">
                            {team.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setSelectedTeamsToAdd([]);
                  }}
                  disabled={isAdding}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleAddSelectedTeams}
                  disabled={isAdding || selectedTeamsToAdd.length === 0}
                >
                  {isAdding ? (
                    <>
                      <Users className="animate-pulse" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus />
                      Add{" "}
                      {selectedTeamsToAdd.length > 0
                        ? `(${selectedTeamsToAdd.length})`
                        : ""}{" "}
                      Team{selectedTeamsToAdd.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Remove Team Confirmation Dialog */}
      <AlertDialog
        open={!!teamToRemove}
        onOpenChange={() => setTeamToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{teamToRemove?.name}</strong> from this tournament? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveTeam}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRemoving ? "Removing..." : "Remove Team"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TournamentTeams;
