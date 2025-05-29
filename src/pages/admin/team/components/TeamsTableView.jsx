import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Users, 
  Trophy, 
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TablePagination from "@/components/ui/table-pagination";

const TeamsTableView = ({
  teams,
  totalItems,
  totalPages,
  currentPage,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onUpdateTeam,
  onDeleteTeam,
}) => {
  const TeamActions = ({ team }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => window.open(`/teams/${team.slug}`, '_blank')}>
          <Eye className="mr-2 h-4 w-4" />
          View Team
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onUpdateTeam(team)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Team
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDeleteTeam(team)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const getDivisionColor = (division) => {
    switch (division?.toLowerCase()) {
      case 'men': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'women': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'mixed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Team</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={team.logo} alt={team.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {team.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{team.name}</div>
                      <div className="text-sm text-muted-foreground">{team.description || 'No description'}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span>{team.sport?.name || 'Unknown Sport'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getDivisionColor(team.division)}>
                    <Shield className="mr-1 h-3 w-3" />
                    {team.division || 'No Division'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{team.players_count || 0} members</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={team.is_active ? "default" : "secondary"}
                    className={team.is_active ? "bg-green-100 text-green-800 border-green-200" : ""}
                  >
                    {team.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <TeamActions team={team} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>      {/* Pagination */}
      {totalItems > 0 && (
        <TablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          isLoading={isLoading}
          itemName="teams"
        />
      )}
    </div>
  );
};

export default TeamsTableView;
