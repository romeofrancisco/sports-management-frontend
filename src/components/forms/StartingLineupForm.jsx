import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useUpdateStartingLineup } from "@/hooks/useStartingLineup";
import { Loader2 } from "lucide-react";
import SelectPlayer from "../common/SelectPlayer";

const StartingLineupForm = ({ teams, game, lineup, onClose }) => {
  const { mutate: updateLineup, isPending } = useUpdateStartingLineup(game.id);
  const { home_team, away_team } = teams;

  const max = game?.max_players_on_field_per_team || 5;

  const formatLineup = (list, teamId) => {
    const filled =
      list?.map((item) => ({
        player: item.player,
        team: item.team,
      })) ?? [];

    const padding = Array.from({ length: max - filled.length }, () => ({
      player: null,
      team: teamId,
    }));

    return [...filled, ...padding];
  };

  const { control, handleSubmit } = useForm({
    defaultValues:
      lineup && game
        ? {
            home_team: formatLineup(
              lineup.home_starting_lineup,
              game.home_team.id
            ),
            away_team: formatLineup(
              lineup.away_starting_lineup,
              game.away_team.id
            ),
          }
        : {
            home_team: [],
            away_team: [],
          },
    mode: "onChange",
  });

  const watchHomePlayers = useWatch({ control, name: "home_team" });
  const watchAwayPlayers = useWatch({ control, name: "away_team" });

  const onSubmit = (data) => {
    updateLineup(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-1">
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3">
        <div className="grid gap-3">
          <div className="flex justify-center items-center gap-2">
            <img
              src={game.home_team.logo}
              alt={game.home_team.name}
              className="w-12"
            />
            <h1 className="text-3xl font-semibold">{game.home_team.name}</h1>
          </div>
          {Array.from({ length: game.max_players_on_field_per_team }).map(
            (_, idx) => (
              <SelectPlayer
                key={idx}
                name={`home_team.${idx}.player`}
                control={control}
                label={`Player ${idx + 1}`}
                placeholder={`Select Player ${idx + 1}`}
                players={home_team} // list of player options
                selectedPlayers={watchHomePlayers
                  ?.map((p) => p.player)
                  .filter(Boolean)}
              />
            )
          )}
        </div>

        <div className="grid md:grid-rows-[auto_1fr_auto] items-stretch place-items-center">
          <span className="hidden md:block mb-5 text-5xl font-bold text-muted-foreground">
            VS
          </span>
          <Separator orientation="vertical" className="hidden md:block" />
          <Separator orientation="horizontal" className="block md:hidden" />
        </div>

        <div className="grid gap-3">
          <div className="flex justify-center items-center gap-2">
            <img
              src={game.away_team.logo}
              alt={game.away_team.name}
              className="w-12"
            />
            <h1 className="text-3xl font-semibold">{game.away_team.name}</h1>
          </div>
          {Array.from({ length: game.max_players_on_field_per_team }).map(
            (_, idx) => (
              <SelectPlayer
                key={idx}
                name={`away_team.${idx}.player`}
                control={control}
                label={`Player ${idx + 1}`}
                placeholder={`Select Player ${idx + 1}`}
                players={away_team} // list of player options
                selectedPlayers={watchAwayPlayers
                  ?.map((p) => p.player)
                  .filter(Boolean)}
              />
            )
          )}
        </div>
      </div>

      <Button type="submit" className="mt-10" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          "Submit Lineup"
        )}
      </Button>
    </form>
  );
};

export default StartingLineupForm;
