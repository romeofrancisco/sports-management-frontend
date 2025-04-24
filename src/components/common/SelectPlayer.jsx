import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Controller } from "react-hook-form";

const SelectPlayer = ({
  name,
  control,
  label,
  players,
  placeholder,
  selectedPlayers,
}) => {
  return (
    <div className="grid gap-1">
      <Label className="text-sm text-left">{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <Select
              value={field.value?.toString()}
              onValueChange={(val) => field.onChange(Number(val))}
            >
              <SelectTrigger className="w-full h-12" size="lg">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {players.length === 0 ? (
                    <SelectItem value={null} disabled>No players available</SelectItem>
                  ) : (
                    players.map((player) => {
                      const isSelected =
                        selectedPlayers?.includes(player.id) &&
                        field.value !== player.id;

                      return (
                        <SelectItem
                          key={player.id}
                          value={String(player.id)}
                          disabled={isSelected}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={player.profile}
                                alt={player.full_name}
                              />
                              <AvatarFallback>
                                {player.first_name[0]}
                                {player.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-left flex flex-col">
                              <span className="text-sm">
                                {player.full_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {player.position
                                  .map((pos) => pos.abbreviation)
                                  .join(", ")}
                              </span>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        }}
      />
    </div>
  );
};

export default SelectPlayer;
