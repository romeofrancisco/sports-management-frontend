import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTrainingMetrics, useTrainingCategories, useSessionMetrics } from '@/hooks/useTrainings';
import { Loader2, Filter, Check } from 'lucide-react';
import { toast } from 'sonner';

const PlayerMetricsConfigModal = ({ 
  isOpen, 
  onClose, 
  playerTraining, 
  sessionMetrics = [],
  playerMetrics = [],
  onSave
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [activeTab, setActiveTab] = useState('session');
  
  // Fetch all metrics and categories
  const { data: allMetrics, isLoading: metricsLoading } = useTrainingMetrics();
  const { data: categories } = useTrainingCategories();

  // Initialize selected metrics when modal opens or player changes
  useEffect(() => {
    if (isOpen && playerMetrics.length > 0) {
      setSelectedMetrics(playerMetrics.map(metric => metric.id));
    } else if (isOpen && sessionMetrics.length > 0) {
      // Pre-select session metrics as default
      setSelectedMetrics(sessionMetrics.map(metric => metric.id));
    } else if (isOpen) {
      setSelectedMetrics([]);
    }
  }, [isOpen, playerMetrics, sessionMetrics]);

  // Get metrics based on the active tab
  const availableMetrics = React.useMemo(() => {
    if (!allMetrics) return [];
    
    if (activeTab === 'session' && sessionMetrics.length > 0) {
      return sessionMetrics;
    }
    return allMetrics;
  }, [allMetrics, sessionMetrics, activeTab]);

  // Filter metrics based on selected category
  const filteredMetrics = React.useMemo(() => {
    if (!availableMetrics) return [];
    
    // Filter by category if one is selected
    if (selectedCategoryId) {
      return availableMetrics.filter(metric => {
        if (typeof metric.category === 'object') {
          return metric.category.id === selectedCategoryId;
        }
        return metric.category === selectedCategoryId;
      });
    }
    
    return availableMetrics;
  }, [availableMetrics, selectedCategoryId]);

  // Handle toggling a metric selection
  const handleToggleMetric = (metricId) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricId)) {
        return prev.filter(id => id !== metricId);
      } else {
        return [...prev, metricId];
      }
    });
  };

  // Handle selecting or deselecting all visible metrics
  const handleToggleAll = (select) => {
    setSelectedMetrics(prev => {
      if (select) {
        // Add all currently filtered metrics to selection
        const newMetricIds = filteredMetrics
          .filter(metric => !prev.includes(metric.id))
          .map(metric => metric.id);
        return [...prev, ...newMetricIds];
      } else {
        // Remove all currently filtered metrics from selection
        return prev.filter(id => 
          !filteredMetrics.some(metric => metric.id === id)
        );
      }
    });
  };

  // Handle saving the configuration
  const handleSave = () => {
    if (typeof onSave === 'function') {
      onSave(selectedMetrics);
    }
    toast.success("Player metrics configured", {
      description: `${selectedMetrics.length} metrics have been assigned to this player.`,
      richColors: true
    });
    onClose();
  };

  if (!playerTraining) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Configure Metrics for {playerTraining.player_name}</DialogTitle>
          <DialogDescription>
            Select which metrics should be recorded for this player during the training session.
            {playerTraining.session_title && (
              <span className="block mt-1 text-sm">
                Session: {playerTraining.session_title} ({playerTraining.session_date})
                {playerTraining.jersey_number && <span> • #{playerTraining.jersey_number}</span>}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-4 flex-1 overflow-hidden">
          {/* Metric source tabs */}
          <Tabs defaultValue="session" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="session">
                Session Metrics {sessionMetrics.length > 0 && `(${sessionMetrics.length})`}
              </TabsTrigger>
              <TabsTrigger value="all">All Available Metrics</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filter controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex flex-wrap gap-2 items-center flex-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by category:</span>
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={selectedCategoryId === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategoryId(null)}
                >
                  All
                </Badge>
                {categories?.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategoryId === category.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleToggleAll(true)}
              >
                Select All
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleToggleAll(false)}
              >
                Deselect All
              </Button>
            </div>
          </div>

          {/* Metrics selection */}
          <div className="flex-1 overflow-hidden">
            {metricsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMetrics.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No metrics found for the selected filters.
              </div>
            ) : (
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-2">
                  {filteredMetrics.map((metric) => (
                    <div 
                      key={metric.id} 
                      className="flex items-center space-x-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
                    >
                      <Checkbox 
                        id={`metric-${metric.id}`}
                        checked={selectedMetrics.includes(metric.id)}
                        onCheckedChange={() => handleToggleMetric(metric.id)}
                      />
                      <div className="flex-1">
                        <Label 
                          htmlFor={`metric-${metric.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {metric.name}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {metric.description} ({metric.unit})
                        </p>
                      </div>
                      {metric.category_name && (
                        <Badge variant="outline" className="text-xs">
                          {metric.category_name || (typeof metric.category === 'object' ? metric.category.name : '')}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <div className="flex items-center text-xs text-muted-foreground mr-auto">
            {selectedMetrics.length} metrics selected
          </div>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerMetricsConfigModal;
