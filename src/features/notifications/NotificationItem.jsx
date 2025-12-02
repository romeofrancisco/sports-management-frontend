import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  NOTIFICATION_TYPE_CONFIG,
  ACTION_TYPE_LABELS,
  DEFAULT_NOTIFICATION_CONFIG,
} from "./constants";

const NotificationItem = ({
  notification,
  onClick,
  onDelete,
  compact = false,
}) => {
  const config =
    NOTIFICATION_TYPE_CONFIG[notification.notification_type] ||
    DEFAULT_NOTIFICATION_CONFIG;

  const IconComponent = config.icon;
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete?.(notification.id);
  };

  return (
    <div
      onClick={() => onClick(notification)}
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer transition-all duration-300 group",
        "hover:bg-primary/10 rounded-md mx-1",
        !notification.is_read && "bg-primary/5"
      )}
    >
      <div className={cn("p-3 rounded-full relative", config.bgColor)}>
        <IconComponent className={cn("size-4", config.color)} />
        {!notification.is_read && (
            <span className="absolute top-0 left-0 size-3 bg-primary/80 rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded font-medium",
              config.bgColor,
              config.color
            )}
          >
            {ACTION_TYPE_LABELS[notification.action_type] || "New"}
          </span>
          <span className="text-xs text-muted-foreground">{config.label}</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {timeAgo}
          </span>
        </div>

        <p
          className={cn(
            "font-medium text-sm mt-1 truncate",
            !notification.is_read && "text-foreground",
            notification.is_read && "text-muted-foreground"
          )}
        >
          {notification.title}
        </p>

        <p
          className={`text-xs text-muted-foreground mt-1 ${
            compact ? "line-clamp-1" : ""
          }`}
        >
          {notification.body}
        </p>
      </div>

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default NotificationItem;
