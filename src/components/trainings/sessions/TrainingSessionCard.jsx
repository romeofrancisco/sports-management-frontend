import React, { useState } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon, 
  ClockIcon, 
  Users, 
  MapPin, 
  PlayCircle, 
  StopCircle,
  Target,
  UserCheck,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../ui/dialog';
import { useDeleteTrainingSession } from '@/hooks/useTrainings';
import { formatDate, formatTime } from '../../../utils/formatters';

/**
 * Component for displaying a training session card with enhanced UI and status-based validation
 * 
 * @param {Object} props
 * @param {Object} props.session - The training session data with status validation flags
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDeleted - Optional callback after successful deletion
 * @param {Function} props.onManage - Function to call when manage session button is clicked
 */
const TrainingSessionCard = ({ 
  session, 
  onEdit, 
  onDeleted, 
  onManage
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutateAsync: deleteSession, isPending: isDeleting } = useDeleteTrainingSession();
  const [activeTab, setActiveTab] = useState("details");
    const handleDelete = async () => {
    try {
      await deleteSession(session.id);
      // Toast notification is handled by the mutation
      if (onDeleted) onDeleted();
    } catch (error) {
      // Error toast notification is handled by the mutation
      console.error("Error deleting session:", error);
    }
  };
    // Format date for display
  const formattedDate = formatDate(session.date);
    // Get session status - use backend status if available, otherwise calculate
  const getSessionStatus = () => {
    // If backend provides status validation flags, use them
    if (session.status) {
      const statusColors = {
        'upcoming': { status: 'upcoming', color: 'bg-blue-500', text: 'Upcoming' },
        'ongoing': { status: 'ongoing', color: 'bg-green-500', text: 'Ongoing' },
        'completed': { status: 'completed', color: 'bg-gray-500', text: 'Completed' }
      };
      return statusColors[session.status] || statusColors['upcoming'];
    }
    
    // Fallback to client-side calculation
    const now = new Date();
    const sessionStart = new Date(`${session.date}T${session.start_time}`);
    const sessionEnd = new Date(`${session.date}T${session.end_time}`);
    
    if (now < sessionStart) {
      return { status: 'upcoming', color: 'bg-blue-500', text: 'Upcoming' };
    } else if (now >= sessionStart && now <= sessionEnd) {
      return { status: 'ongoing', color: 'bg-green-500', text: 'Ongoing' };
    } else {
      return { status: 'completed', color: 'bg-gray-500', text: 'Completed' };
    }
  };
  const sessionStatus = getSessionStatus();
  
  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card/95 to-muted/20 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/20">
      {/* Status indicator */}
      <div className={`absolute top-0 right-0 w-3 h-3 ${sessionStatus.color} rounded-bl-lg`}></div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-muted/30 border-b border-border/30">
          <TabsTrigger 
            value="details" 
            className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
          >
            <Target className="h-4 w-4 mr-2" />
            Details
          </TabsTrigger>
          <TabsTrigger 
            value="actions" 
            className="flex-1 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all duration-200"
          >
            <Settings className="h-4 w-4 mr-2" />
            Actions
          </TabsTrigger>
        </TabsList>        
        <TabsContent value="details" className="m-0">
          <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {session.title}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-1 font-medium border-0 text-white ${sessionStatus.color}`}
                  >
                    {sessionStatus.text}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={onEdit}
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setConfirmDelete(true)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Team</div>
                  <div className="text-xs text-muted-foreground">
                    {session.team_name || 'No team specified'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="p-2 rounded-full bg-secondary/10">
                  <MapPin className="h-4 w-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Location</div>
                  <div className="text-xs text-muted-foreground">{session.location}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="p-2 rounded-full bg-accent/10">
                  <PlayCircle className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Type</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {session.training_type === 'team' ? 'Team Training' : 'Individual Training'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <UserCheck className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Players</div>
                  <div className="text-xs text-muted-foreground">
                    {session.players_count > 0 
                      ? `${session.players_count} player${session.players_count !== 1 ? 's' : ''} enrolled`
                      : 'No players enrolled yet'
                    }
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>        <TabsContent value="actions" className="m-0">
          <CardContent className="pt-6 pb-4">
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline" 
                size="sm"
                className="w-full justify-start h-12 transition-all duration-200 hover:bg-primary/5 hover:border-primary/20"
                onClick={onManage}
              >
                <Settings className="mr-3 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Manage Session</div>
                  <div className="text-xs text-muted-foreground">
                    Attendance, metrics, and player records
                  </div>
                </div>              </Button>
              
              <Button
                variant="outline" 
                size="sm"
                className="w-full justify-start h-12 hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
                onClick={onEdit}
              >
                <PencilIcon className="mr-3 h-4 w-4 text-primary" />
                <div className="text-left">
                  <div className="font-medium">Edit Session</div>
                  <div className="text-xs text-muted-foreground">Modify session details</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </TabsContent></Tabs>
      
      <CardFooter className="bg-gradient-to-r from-muted/40 to-muted/20 border-t border-border/30 px-4 py-3">
        <div className="flex justify-between items-center w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              <span className="font-medium">{session.duration_minutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="font-medium">{session.coach_name || 'Unassigned'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${sessionStatus.color}`}></div>
            <span className="font-medium">{sessionStatus.text}</span>
          </div>
        </div>
      </CardFooter>
      
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <TrashIcon className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-semibold text-foreground">"{session.title}"</span>? 
              This action cannot be undone and will permanently remove all associated data.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setConfirmDelete(false)}
              className="hover:bg-muted/50"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TrainingSessionCard;
