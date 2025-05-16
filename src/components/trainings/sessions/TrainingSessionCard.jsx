import React, { useState } from 'react';
import { PencilIcon, TrashIcon, CalendarIcon, ClockIcon } from 'lucide-react';
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
 * Component for displaying a training session card
 * 
 * @param {Object} props
 * @param {Object} props.session - The training session data
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDeleted - Optional callback after successful deletion
 */
const TrainingSessionCard = ({ session, onEdit, onDeleted }) => {
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
  
  return (
    <Card className="overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
          <TabsTrigger value="players" className="flex-1">Players</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{session.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span>{formattedDate}</span>
                  <ClockIcon className="ml-3 mr-1 h-4 w-4" />
                  <span>{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button size="sm" variant="ghost" onClick={onEdit}>
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)}>
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="font-medium">Team:</div>
                <div>{session.team_name || 'No team specified'}</div>
              </div>
              <div>
                <div className="font-medium">Location:</div>
                <div>{session.location}</div>
              </div>
              <div>
                <div className="font-medium">Type:</div>
                <Badge variant="outline" className="mt-1">
                  {session.training_type === 'team' ? 'Team Training' : 'Individual Training'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="players">
          <CardContent className="pt-4">
            <div className="font-medium mb-2">Players:</div>
            <div className="text-sm text-muted-foreground">
              {session.players_count > 0 
                ? `${session.players_count} player${session.players_count !== 1 ? 's' : ''} in this session`
                : 'No players added to this session yet'
              }
            </div>
            
            <Button
              variant="outline" 
              size="sm"
              className="w-full mt-4"
              onClick={onEdit}
            >
              <PencilIcon className="mr-2 h-4 w-4" />
              Manage Players
            </Button>
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="bg-muted/50 flex justify-between pt-1 pb-1">
        <div className="text-xs text-muted-foreground">
          Duration: {session.duration_minutes} minutes
        </div>
        <div className="text-xs text-muted-foreground">
          Coach: {session.coach_name || 'Not assigned'}
        </div>
      </CardFooter>
      
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{session.title}"? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TrainingSessionCard;
