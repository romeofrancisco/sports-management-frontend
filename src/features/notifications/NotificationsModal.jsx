import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader2,
  Inbox,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotificationLogs,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import {
  NOTIFICATION_TYPE_CONFIG,
  DEFAULT_NOTIFICATION_CONFIG,
} from "./constants";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const ITEMS_PER_PAGE = 10;

const NotificationsModal = ({ open, onOpenChange, onNotificationClick }) => {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [readFilter, setReadFilter] = useState("all");
  const { isAdmin } = useRolePermissions();

  // Map combined filter values to actual notification types
  const getNotificationTypes = (filter) => {
    switch (filter) {
      case "games":
        return "league_game,tournament_game,practice_game,bulk_games";
      case "facility":
        return "facility,facility_status";
      case "all":
        return undefined;
      default:
        return filter;
    }
  };

  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useNotificationLogs({
    page,
    limit: ITEMS_PER_PAGE,
    notification_type: getNotificationTypes(activeFilter),
    is_read:
      readFilter === "unread"
        ? false
        : readFilter === "read"
        ? true
        : undefined,
  });

  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();

  const { mutate: deleteNotification } = useDeleteNotification();

  const { mutate: deleteAllNotifications, isPending: isDeletingAll } =
    useDeleteAllNotifications();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeFilter, readFilter]);

  // Refetch when modal opens
  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const notifications = notificationsData?.results || [];
  const totalCount = notificationsData?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleMarkAllRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => refetch(),
    });
  };

  const handleDeleteNotification = (notificationId) => {
    deleteNotification(notificationId, {
      onSuccess: () => refetch(),
    });
  };

  const handleDeleteAll = () => {
    deleteAllNotifications(undefined, {
      onSuccess: () => refetch(),
    });
  };

  const filterTypes = [
    { value: "all", label: "All" },
    { value: "event", label: "Events" },
    { value: "games", label: "Games" },
    { value: "training", label: "Training" },
    { value: "facility", label: "Facilities" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col">
        <DialogHeader className="p-4 pb-2 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
            {totalCount > 0 && <Badge>{totalCount}</Badge>}
          </DialogTitle>

          {/* Read/Unread tabs */}
          <Tabs
            value={readFilter}
            onValueChange={setReadFilter}
            className="mt-2"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Type filters */}
          {!isAdmin() && (
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground shrink-0" />
              <ScrollArea className="flex-1 overflow-hidden whitespace-nowrap">
                <div className="flex w-max space-x-1 py-2">
                  {filterTypes.map((filter) => {
                    const config = NOTIFICATION_TYPE_CONFIG[filter.value];
                    return (
                      <Button
                        key={filter.value}
                        variant={
                          activeFilter === filter.value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setActiveFilter(filter.value)}
                        className={cn(
                          "shrink-0 text-xs",
                          activeFilter === filter.value &&
                            "bg-primary text-primary-foreground"
                        )}
                      >
                        {config && <config.icon className="h-3 w-3 mr-1" />}
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          )}
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-96px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Inbox className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">
                {readFilter === "unread"
                  ? "You're all caught up!"
                  : "No notifications to display"}
              </p>
            </div>
          ) : (
            <div className="divide-y space-y-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={onNotificationClick}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages} ({totalCount} total)
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <DialogFooter className="p-4 border-t flex justify-between">
          <Button
            variant="outline"
            onClick={handleDeleteAll}
            disabled={isDeletingAll || notifications.length === 0}
            className="text-destructive hover:text-destructive"
          >
            {isDeletingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete all
          </Button>
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll}
            className="flex-1"
          >
            {isMarkingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Mark all as read
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationsModal;
