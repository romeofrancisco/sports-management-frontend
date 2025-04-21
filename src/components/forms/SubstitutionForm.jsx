import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import SelectPlayer from "../common/SelectPlayer";
import { useSubstitution } from "@/hooks/useSubstitution";
import { useSelector } from "react-redux";

const SubstitutionForm = ({ currentPlayers, gamePlayers, onClose }) => {
  const { game_id, home_team, away_team, max_players_on_field_per_team, current_period } =
    useSelector((state) => state.game);
  const { mutate: submitSubs, isPending } = useSubstitution(game_id);

  const max = max_players_on_field_per_team || 5;

  const formatInitial = (list) =>
    list?.map((item) => ({
      current: item.id, // current player ID
      sub: item.id, // initially same (not yet substituted)
    })) ?? [];

  const defaultValues = {
    home_team: formatInitial(currentPlayers.home_players),
    away_team: formatInitial(currentPlayers.away_players),
  };

  const { control, handleSubmit } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const watchHome = useWatch({ control, name: "home_team" });
  const watchAway = useWatch({ control, name: "away_team" });

  const getPlayerName = (id) => {
    const all = [...gamePlayers.home_team, ...gamePlayers.away_team];
    return all.find((p) => p.id === id)?.name || "Unknown";
  };

  const onSubmit = (data) => {
    const formatSubs = (teamData) =>
      teamData
        .filter((p) => p.current && p.sub && p.current !== p.sub)
        .map((p) => ({
          game: game_id,
          substitute_out: p.current,
          substitute_in: p.sub,
          period: current_period,
        }));

    const homeSubs = formatSubs(data.home_team);
    const awaySubs = formatSubs(data.away_team);
    const allSubs = [...homeSubs, ...awaySubs];
    console.log(allSubs);
    if (allSubs.length === 0) {
      onClose?.();
      return;
    }

    submitSubs(allSubs, {
      onSuccess: () => {
        onClose?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-1">
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3">
        {/* Home Team */}
        <div className="grid gap-3">
          <div className="flex justify-center items-center gap-2">
            <img src={home_team.logo} alt={home_team.name} className="w-12" />
            <h1 className="text-3xl font-semibold">{home_team.name}</h1>
          </div>
          {Array.from({ length: max }).map((_, idx) => {
            const currentPlayer = currentPlayers.home_players[idx];
            return (
              <SelectPlayer
                key={idx}
                name={`home_team.${idx}.sub`}
                control={control}
                label={`Sub for ${getPlayerName(currentPlayer.id)}`}
                placeholder={`Select substitute for ${getPlayerName(
                  currentPlayer.id
                )}`}
                players={gamePlayers.home_team}
                selectedPlayers={watchHome?.map((p) => p.sub).filter(Boolean)}
              />
            );
          })}
        </div>

        {/* VS Separator */}
        <div className="grid md:grid-rows-[auto_1fr_auto] items-stretch place-items-center">
          <span className="hidden md:block mb-5 text-5xl font-bold text-muted-foreground">
            VS
          </span>
          <Separator orientation="vertical" className="hidden md:block" />
          <Separator orientation="horizontal" className="block md:hidden" />
        </div>

        {/* Away Team */}
        <div className="grid gap-3">
          <div className="flex justify-center items-center gap-2">
            <img src={away_team.logo} alt={away_team.name} className="w-12" />
            <h1 className="text-3xl font-semibold">{away_team.name}</h1>
          </div>
          {Array.from({ length: max }).map((_, idx) => {
            const currentPlayer = currentPlayers.away_players[idx];
            return (
              <SelectPlayer
                key={idx}
                name={`away_team.${idx}.sub`}
                control={control}
                label={`Sub for ${getPlayerName(currentPlayer.player)}`}
                placeholder={`Select substitute for ${getPlayerName(
                  currentPlayer.id
                )}`}
                players={gamePlayers.away_team}
                selectedPlayers={watchAway?.map((p) => p.sub).filter(Boolean)}
              />
            );
          })}
        </div>
      </div>

      <Button type="submit" className="mt-10" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          "Submit Substitutions"
        )}
      </Button>
    </form>
  );
};

export default SubstitutionForm;
