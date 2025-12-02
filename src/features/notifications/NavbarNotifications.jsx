import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, CheckCheck } from "lucide-react";
import {
  useNotificationLogs,
  useUnreadCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import NotificationsModal from "./NotificationsModal";

const NavbarNotifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: unreadData } = useUnreadCount();
  const unreadCount = unreadData?.unread_count || 0;

  const { data: notificationsData, isLoading } = useNotificationLogs({
    page_size: 10,
  });
  const notifications = notificationsData?.results || [];

  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }

    if (notification.click_action) {
      window.location.href = notification.click_action;
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl bg-gradient-to-r from-background/80 to-background/60 border border-border/50 hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 transition-all duration-300"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-96 flex flex-col bg-gradient-to-br from-card via-card to-card/95 shadow-2xl border-2 border-primary/20 rounded-2xl backdrop-blur-md"
          sideOffset={8}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <DropdownMenuLabel className="p-0 font-semibold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Notifications
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-primary hover:text-primary/80"
                onClick={handleMarkAllRead}
                disabled={markAllAsRead.isPending}
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {isLoading ? (
            <div className="flex items-center justify-center py-8 flex-1">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex-1">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <ScrollArea>
              <div className="max-h-80 space-y-1">
                {notifications.slice(0, 5).map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClick={handleNotificationClick}
                    compact
                  />
                ))}
              </div>
            </ScrollArea>
          )}

          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <DropdownMenuItem
            onClick={() => setIsModalOpen(true)}
            className="p-3 cursor-pointer hover:bg-primary/10 transition-all duration-300 text-center font-medium text-primary justify-center"
          >
            View All Notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Full Notifications Modal */}
      <NotificationsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onNotificationClick={handleNotificationClick}
      />
    </>
  );
};

export default NavbarNotifications;
