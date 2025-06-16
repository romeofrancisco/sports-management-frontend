import React, { useState, memo, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ATTENDANCE_STATUS } from "@/constants/trainings";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, Trophy, Target, User } from "lucide-react";

const getAttendanceColumns = (
  onStatusChange,
  onNotesChange,
  disabled = false
) => [  {
    accessorKey: "player_name",
    header: "Player",
    cell: ({ row }) => {
      const player = row.original.player || {};
      const playerName = row.original.player_name || player.full_name || 
        `${player.first_name || ""} ${player.last_name || ""}`.trim() || "Unknown Player";
        return (
        <div className="flex items-center gap-3 py-1">
          <Avatar className="h-8 w-8 border-2 border-primary/20">
            <AvatarImage 
              src={player?.profile || player?.user?.profile} 
              alt={playerName} 
            />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-sm">
              {player?.jersey_number ? (
                <span className="text-xs">#{player.jersey_number}</span>
              ) : player?.profile ? (
                <User className="h-4 w-4" />
              ) : (
                `${player?.first_name?.[0] || ''}${player?.last_name?.[0] || ''}`.toUpperCase() || '??'
              )}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-foreground truncate">
              {playerName}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {player.jersey_number && (
                <span>#{player.jersey_number}</span>
              )}
              {player.position && (
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {player.position}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    },
    size: 220,
    className: "w-[220px] min-w-[220px]",
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => {
      // Use React.memo pattern to prevent re-renders
      const NotesCell = React.memo(({ rowData, onChangeHandler }) => {
        // Track the input value in local state to avoid losing focus
        const [localValue, setLocalValue] = React.useState(rowData.notes || "");

        // Update form only on blur to prevent losing focus
        const handleChange = (e) => {
          setLocalValue(e.target.value);
        };

        const handleBlur = (e) => {
          onChangeHandler(rowData.id, e.target.value);
        };
        return (
          <div className="w-full max-w-[250px]">
            <Textarea
              className="min-h-[32px] text-xs w-full max-h-[3rem]"
              value={localValue}
              placeholder="Add notes..."
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled}
              rows={2}
            />
          </div>
        );
      });

      // Prevent re-renders by using a stable reference
      NotesCell.displayName = `NotesCell_${row.original.id}`;

      return (
        <NotesCell rowData={row.original} onChangeHandler={onNotesChange} />
      );
    },
    size: 250,
    className: "w-[250px] min-w-[250px]",
  },
  {
    accessorKey: "attendance_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.attendance_status || "pending";
      const recordId = row.original.id; // Define status-based styles for better UX
      const statusStyles = {
        present: {
          bg: "rgba(139,21,56,0.08)",
          color: "#8B1538",
          hoverBg: "rgba(139,21,56,0.25)",
        },
        absent: {
          bg: "rgba(220,20,60,0.08)",
          color: "#DC143C",
          hoverBg: "rgba(220,20,60,0.25)",
        },
        pending: {
          bg: "rgba(184,134,11,0.08)",
          color: "#B8860B",
          hoverBg: "rgba(184,134,11,0.25)",
        },
        excused: {
          bg: "rgba(255,215,0,0.08)",
          color: "#FFD700",
          hoverBg: "rgba(255,215,0,0.25)",
        },
        late: {
          bg: "rgba(218,165,32,0.08)",
          color: "#DAA520",
          hoverBg: "rgba(218,165,32,0.25)",
        },
      };

      const currentStyle = statusStyles[status] || statusStyles.pending;
      const label = status.charAt(0).toUpperCase() + status.slice(1);

      return (
        <div className="w-[100px] flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={disabled}>
              <Button
                variant="outline"
                disabled={disabled}
                className="font-medium transition-colors px-3 py-1.5 text-xs h-auto w-[90px]"
                style={{
                  backgroundColor: currentStyle.bg,
                  color: currentStyle.color,
                  borderColor: "transparent",
                  opacity: disabled ? 0.5 : 1,
                }}
              >
                {label}
                {!disabled && (
                  <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-100" />
                )}
              </Button>
            </DropdownMenuTrigger>
            {!disabled && (
              <DropdownMenuContent align="center" className="w-[120px]">
                <DropdownMenuLabel className="text-xs">
                  Set Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(ATTENDANCE_STATUS).map(([key, value]) => {
                  const style = statusStyles[value] || statusStyles.pending;
                  return (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => {
                        console.log(
                          "Status dropdown item clicked:",
                          recordId,
                          value
                        );
                        onStatusChange && onStatusChange(recordId, value);
                      }}
                      className={
                        value === status ? "font-medium bg-muted/40" : ""
                      }
                    >
                      <div
                        style={{ color: style.color }}
                        className="flex items-center w-full"
                      >
                        <span className="h-2 w-2 rounded-full mr-1.5"></span>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        </div>
      );
    },
    size: 100,
    className: "w-[100px] min-w-[100px]",
  },
];

export default getAttendanceColumns;
