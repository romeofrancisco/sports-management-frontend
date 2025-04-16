import {
    Avatar,
    AvatarImage,
    AvatarFallback,
  } from "@/components/ui/avatar";
  import {
    Card,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import CoachActions from "./CoachActions";
  
  const CoachCard = ({ coach, onDelete, onUpdate }) => {
    return (
      <Card className="rounded-lg shadow-sm hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={coach.profile} alt={coach.first_name} />
              <AvatarFallback className="bg-accent">
                {coach.first_name[0]}
                {coach.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-sm font-medium">
                {coach.first_name} {coach.last_name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{coach.email}</p>
            </div>
          </div>
          <CoachActions coach={coach} onDelete={onDelete} onUpdate={onUpdate} />
        </CardHeader>
      </Card>
    );
  };
  
  export default CoachCard;
  