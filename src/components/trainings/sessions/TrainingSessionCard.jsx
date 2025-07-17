import React from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  CalendarIcon, 
  ClockIcon, 
  Users, 
  MapPin, 
  Target,
  UserCheck,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { formatTime } from '../../../utils/formatters';
import { formatShortDate } from '@/utils/formatDate';

/**
 * Component for displaying a training session card with enhanced UI and status-based validation
 * 
 * @param {Object} props
 * @param {Object} props.session - The training session data with status validation flags
 * @param {Function} props.onEdit - Function to call when edit button is clicked
 * @param {Function} props.onDelete - Function to call when delete button is clicked
 * @param {Function} props.onManage - Function to call when manage session button is clicked
 */
const TrainingSessionCard = ({ 
  session, 
  onEdit, 
  onDelete, 
  onManage
}) => {
    // Format date for display
  const formattedDate = formatShortDate(session.date);
    // Get session status with comprehensive styling info like SessionCard
  const getSessionStatusInfo = () => {
    let status = session.status?.toLowerCase();
    
    // If no backend status, calculate from dates
    if (!status) {
      const now = new Date();
      const sessionStart = new Date(`${session.date}T${session.start_time}`);
      const sessionEnd = new Date(`${session.date}T${session.end_time}`);
      
      if (now < sessionStart) {
        status = 'upcoming';
      } else if (now >= sessionStart && now <= sessionEnd) {
        status = 'ongoing';
      } else {
        status = 'completed';
      }
    }

    // Status-based styling similar to SessionCard
    if (status === 'ongoing' || status === 'in_progress' || status === 'active') {
      return {
        gradient: 'from-secondary/10 to-secondary/20',
        strip: 'bg-secondary',
        borderColor: 'border-secondary/30',
        textColor: 'text-secondary',
        bgColor: 'bg-secondary/10',
        badgeClass: 'bg-secondary/10 text-secondary border-secondary/20',
        statusText: 'Ongoing',
        primaryColor: 'secondary'
      };
    } else if (status === 'completed') {
      return {
        gradient: 'from-primary/10 to-primary/20',
        strip: 'bg-primary',
        borderColor: 'border-primary/30',
        textColor: 'text-primary',
        bgColor: 'bg-primary/10',
        badgeClass: 'bg-primary/10 text-primary border-primary/20',
        statusText: 'Completed',
        primaryColor: 'primary'
      };
    } else {
      // upcoming or default
      return {
        gradient: 'from-orange-500/10 to-orange-500/20',
        strip: 'bg-orange-500',
        borderColor: 'border-orange-500/30',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-500/10',
        badgeClass: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
        statusText: 'Upcoming',
        primaryColor: 'orange'
      };
    }
  };
  
  const statusInfo = getSessionStatusInfo();
  
  return (
    <Card className={`group relative overflow-hidden bg-gradient-to-br ${statusInfo.gradient} hover:shadow-lg transition-all duration-300 border ${statusInfo.borderColor} shadow-sm h-full flex flex-col`}>
      {/* Status Strip like SessionCard */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${statusInfo.strip}`} />
      
      {/* Header Section */}
      <CardHeader className="pb-4 pt-3 relative">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-full ${statusInfo.bgColor}`}>
                <Target className={`h-4 w-4 ${statusInfo.textColor}`} />
              </div>
              <CardTitle className={`text-xl font-bold ${statusInfo.textColor} leading-tight`}>
                {session.title}
              </CardTitle>
              <Badge className={`text-xs font-medium border ${statusInfo.badgeClass}`}>
                {statusInfo.statusText}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground ml-11">
              <CalendarIcon className="h-4 w-4" />
              <span className="font-medium">{formattedDate}</span>
              <div className="w-1 h-1 bg-muted-foreground/40 rounded-full"></div>
              <ClockIcon className="h-4 w-4" />
              <span className="font-medium">{formatTime(session.start_time)} - {formatTime(session.end_time)}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={`h-9 w-9 p-0 rounded-lg hover:${statusInfo.bgColor} hover:${statusInfo.textColor} transition-all duration-200 group/edit`}
              onClick={onEdit}
              aria-label="Edit Session"
            >
              <PencilIcon className="h-4 w-4 group-hover/edit:scale-110 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group/delete"
              onClick={() => onDelete?.(session)}
              aria-label="Delete Session"
            >
              <TrashIcon className="h-4 w-4 group-hover/delete:scale-110 transition-transform" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className={`h-9 px-4 rounded-lg ${statusInfo.strip} text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg group/manage`}
              onClick={onManage}
              aria-label="Manage Session"
            >
              <Settings className="h-4 w-4 mr-2 group-hover/manage:rotate-45 transition-transform duration-300" />
              <span className="hidden sm:inline">Manage</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="space-y-4 pt-0 flex-1">
        {/* Main Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={`group/item flex items-center gap-3 p-3 rounded-lg ${statusInfo.gradient} border ${statusInfo.borderColor} hover:border-opacity-50 transition-all duration-300`}>
            <div className={`p-2 rounded-lg ${statusInfo.bgColor} group-hover/item:opacity-80 transition-colors`}>
              <MapPin className={`h-4 w-4 ${statusInfo.textColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${statusInfo.textColor} uppercase tracking-wide`}>Location</p>
              <p className="text-sm font-semibold text-foreground truncate">{session.location || 'No location specified'}</p>
            </div>
          </div>

          <div className={`group/item flex items-center gap-3 p-3 rounded-lg ${statusInfo.gradient} border ${statusInfo.borderColor} hover:border-opacity-50 transition-all duration-300`}>
            <div className={`p-2 rounded-lg ${statusInfo.bgColor} group-hover/item:opacity-80 transition-colors`}>
              <Users className={`h-4 w-4 ${statusInfo.textColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${statusInfo.textColor} uppercase tracking-wide`}>Team</p>
              <p className="text-sm font-semibold text-foreground truncate">{session.team_name || 'No team specified'}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`p-4 rounded-lg ${statusInfo.gradient} border ${statusInfo.borderColor}`}>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg ${statusInfo.bgColor}`}>
                <ClockIcon className={`h-5 w-5 ${statusInfo.textColor}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Duration</p>
              <p className={`text-base font-bold ${statusInfo.textColor}`}>{session.duration_minutes}<span className="text-xs ml-1">min</span></p>
            </div>
            
            <div className="text-center">
              <div className={`flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg ${statusInfo.bgColor}`}>
                <UserCheck className={`h-5 w-5 ${statusInfo.textColor}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Players</p>
              <p className={`text-base font-bold ${statusInfo.textColor}`}>{session.players_count || 0}</p>
            </div>

            <div className="text-center">
              <div className={`flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-lg ${statusInfo.bgColor}`}>
                <Target className={`h-5 w-5 ${statusInfo.textColor}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</p>
              <p className={`text-sm font-bold ${statusInfo.textColor}`}>Training</p>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className={`${statusInfo.gradient} border-t ${statusInfo.borderColor} px-4 py-3`}>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusInfo.strip} text-white text-xs font-medium shadow-sm`}>
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              {statusInfo.statusText}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`px-2 py-1 ${statusInfo.bgColor} rounded-full font-medium ${statusInfo.textColor}`}>
              {session.players_count > 0 
                ? `${session.players_count} enrolled`
                : 'No enrollments'}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TrainingSessionCard;
