import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PlayerStatsSummaryTable = ({ players }) => {
  // Collect all stat keys from both base and calculated stats
  const allStatKeys = [
    ...new Set(
      players.flatMap((player) => [
        ...Object.keys(player.total_stats.base_stats),
        ...Object.keys(player.total_stats.calculated_stats),
      ])
    ),
  ];

  // Group keys by stat prefix
  const statGroups = allStatKeys.reduce((groups, key) => {
    const match = key.match(/^(.*?)(?:_(MA|AT|PC))?$/);
    const prefix = match[1];

    if (!groups[prefix]) {
      groups[prefix] = {
        keys: [],
        isComposite: false,
      };
    }

    groups[prefix].keys.push(key);

    if (/_MA$|_AT$|_PC$/.test(key)) {
      groups[prefix].isComposite = true;
    }

    return groups;
  }, {});

  const sortedGroupEntries = Object.entries(statGroups).sort(([, a], [, b]) => {
    if (a.isComposite === b.isComposite) return 0;
    return a.isComposite ? 1 : -1;
  });

  return (
    <Table>
      <TableHeader className="text-[0.5rem] md:text-sm">
        <TableRow>
          <TableHead>Player</TableHead>
          <TableHead>PTS</TableHead>
          {sortedGroupEntries.map(([groupName, group]) =>
            group.isComposite ? (
              <React.Fragment key={groupName}>
                <TableHead>{groupName}</TableHead>
                <TableHead>{`${groupName}%`}</TableHead>
              </React.Fragment>
            ) : (
              <TableHead key={groupName}>{groupName}</TableHead>
            )
          )}
        </TableRow>
      </TableHeader>

      <TableBody className="text-[0.5rem] md:text-sm">
        {players.map((player) => (
          <TableRow key={player.id}>
            <TableCell className="grid grid-cols-[1rem_auto] gap-2 ps-1">
              <span className="text-muted-foreground text-end">
                {player.jersey_number}
              </span>
              <span>{player.name}</span>
            </TableCell>
            <TableCell>{player.total_points}</TableCell>

            {sortedGroupEntries.map(([groupName, group]) => {
              const base = player.total_stats.base_stats;
              const calc = player.total_stats.calculated_stats;

              if (group.isComposite) {
                const made = calc[`${groupName}_MA`] ?? 0;
                const att = calc[`${groupName}_AT`] ?? 0;
                const pc = calc[`${groupName}_PC`] ?? 0;

                return (
                  <React.Fragment key={groupName}>
                    <TableCell>{`${made}/${att}`}</TableCell>
                    <TableCell>{`${pc.toFixed(1)}%`}</TableCell>
                  </React.Fragment>
                );
              } else {
                const value = base[groupName] ?? calc[groupName] ?? 0;
                return <TableCell key={groupName}>{value}</TableCell>;
              }
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PlayerStatsSummaryTable;
