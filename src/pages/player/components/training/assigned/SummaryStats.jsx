import React from "react";
import { 
  Target, CheckCircle, XCircle, Clock, Trophy
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SummaryStats = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <div className="text-2xl font-bold">{summary.total_metrics}</div>
              <div className="text-xs text-muted-foreground">Total Metrics</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {summary.completed}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {summary.in_progress}
              </div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {summary.assigned}
              </div>
              <div className="text-xs text-muted-foreground">Assigned</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">
                {summary.missed}
              </div>
              <div className="text-xs text-muted-foreground">Missed</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {summary.completion_rate}%
              </div>
              <div className="text-xs text-muted-foreground">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryStats;
