import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { Avatar, AvatarImage } from "../ui/avatar";
import { TEAM_SIDES } from "@/constants/game";
import { useCreateStartingLineup } from "@/hooks/useStartingLineup";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const TeamLineupSection = ({
  team,
  game,
  positions,
  control,
  teamSide,
  formValues,
  errors,
}) => {
  const teamData = teamSide === "home" ? game.home_team : game.away_team;
  const fieldName = `${teamSide}_positions`;

  return (
    <div>
      <h2 className="text-lg font-medium mb-2">
        {teamData.name}'s Starting Lineup
      </h2>
      {positions?.map((pos, index) => (
        <PositionSelect
          key={`${teamSide}-${pos.id}`}
          pos={pos}
          index={index}
          team={team}
          teamName={teamData.name}
          control={control}
          fieldName={fieldName}
          formValues={formValues}
          errors={errors}
        />
      ))}
    </div>
  );
};

const PositionSelect = ({
  pos,
  index,
  team,
  teamName,
  control,
  fieldName,
  formValues,
  errors,
}) => {
  const currentField = `${fieldName}.${index}.player`;
  // Sort the players base on the position needed in select
  const sortedPlayers = React.useMemo(
    () =>
      [...team].sort((a, b) => {
        const aHasPosition = a.position.some((p) => p.id === pos.id);
        const bHasPosition = b.position.some((p) => p.id === pos.id);
        return bHasPosition - aHasPosition;
      }),
    [team, pos.id]
  );

  // Check if the player is disabled
  const isPlayerDisabled = (playerId) => {
    const allSelections = [
      ...(formValues.home_positions || []),
      ...(formValues.away_positions || []),
    ];

    return allSelections.some((selection, idx) => {
      const isSameField =
        fieldName === "home_positions"
          ? idx === index
          : idx === index + (formValues.home_positions?.length || 0);

      return !isSameField && selection.player === String(playerId);
    });
  };

  return (
    <div className="grid gap-1 mb-3">
      <Label className="text-sm">{pos.name}</Label>
      <Controller
        name={currentField}
        control={control}
        rules={{ required: "Player is required" }}
        render={({ field }) => (
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={!team?.length}
          >
            <SelectTrigger className="w-full min-h-[2.7rem]">
              <SelectValue placeholder={`Select ${pos.name} for ${teamName}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{teamName} Players</SelectLabel>
                {sortedPlayers.map((player) => (
                  <SelectItem
                    key={player.id}
                    value={String(player.id)}
                    disabled={isPlayerDisabled(player.id)}
                  >
                    <div className="flex items-center gap-2 py-1">
                      <Avatar>
                        <AvatarImage
                          src={player.profile}
                          alt={player.full_name}
                        />
                      </Avatar>
                      <span>#{player.jersey_number}</span>
                      <span>{player.full_name}</span>
                      <span className="font-medium">
                        {player.position.map((p) => p.abbreviation).join(", ")}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {errors?.[fieldName]?.[index]?.player && (
        <p className="text-destructive text-xs">
          {errors[fieldName][index].player.message}
        </p>
      )}
    </div>
  );
};

const UpdateStartingLineupForm = ({
  teams,
  game,
  positions,
  onClose,
  startingLineup,
}) => {
  const { mutate: updateLineup, isPending } = useCreateStartingLineup(game.id);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      home_positions:
        startingLineup?.home_starting_lineup.map((lineup) => ({
          position: lineup.position,
          player: String(lineup.player), // Ensure it's a string since Select expects a string value
        })) || [],
      away_positions:
        startingLineup?.away_starting_lineup.map((lineup) => ({
          position: lineup.position,
          player: String(lineup.player),
        })) || [],
    },
  });

  const formValues = watch();

  const onSubmit = (data) => {
    const formattedData = {
      home_team: [...data.home_positions],
      away_team: [...data.away_positions],
    };

    updateLineup(formattedData, {
      onSuccess: () => {
        onClose();
        toast.success("Starting Lineup Updated", {
          description: "You can now start the game",
          richColors: true,
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid px-1 gap-5">
      <TeamLineupSection
        team={teams[TEAM_SIDES.HOME_TEAM]}
        game={game}
        positions={positions}
        control={control}
        teamSide="home"
        formValues={formValues}
        errors={errors}
      />

      <Separator className="min-h-px" />

      <TeamLineupSection
        team={teams[TEAM_SIDES.AWAY_TEAM]}
        game={game}
        positions={positions}
        control={control}
        teamSide="away"
        formValues={formValues}
        errors={errors}
      />

      <Button type="submit" className="mt-4" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          "Update lineup"
        )}
      </Button>
    </form>
  );
};

export default UpdateStartingLineupForm;
