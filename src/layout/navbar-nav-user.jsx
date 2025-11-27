import React, { useState } from "react";
import {
  BadgeCheck,
  Bell,
  ChevronRight,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  MessageCircleMore,
  Moon,
  Palette,
  Settings,
  Sparkles,
  Sun,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLogout } from "@/hooks/useAuth";
import { useSelector } from "react-redux";
import { setManualLogout } from "@/utils/logoutFlag";
import { useTheme } from "@/context/ThemeProvider";
import { useModal } from "@/hooks/useModal";
import UserProfileModal from "@/components/modals/UserProfileModal";
import { Switch } from "@/components/ui/switch";
import { setGlobalMute } from "@/utils/notificationSettings";

export function NavbarNavUser() {
  const { user } = useSelector((state) => state.auth);
  const logOut = useLogout();
  const { setTheme, theme } = useTheme();
  const profileModal = useModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatNotificationsEnabled, setChatNotificationsEnabled] = useState(() => {
    // Load from localStorage, default to true
    const saved = localStorage.getItem('chatNotificationsEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const handleChatNotificationToggle = async (checked) => {
    setChatNotificationsEnabled(checked);
    // Sync to both localStorage and IndexedDB (for service worker access)
    await setGlobalMute(checked);
  };

  const handleLogout = () => {
    setManualLogout(true);
    logOut.mutate();
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="group relative h-12 w-12 rounded-xl bg-gradient-to-br from-card/60 to-card/80 backdrop-blur-md border border-primary/20 shadow-lg transition-all duration-500 ease-out hover:shadow-xl hover:scale-105 hover:border-primary/40 hover:from-primary/10 hover:to-primary/20"
          >
            <Avatar className="h-8 w-8 transition-all duration-300 group-hover:scale-110">
              <AvatarImage src={user?.profile} alt={user?.first_name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {/* Enhanced hover effects */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[320px] bg-gradient-to-br from-card via-card to-card/95 shadow-2xl border-2 border-primary/20 rounded-2xl backdrop-blur-md overflow-visible"
          align="end"
          forceMount
          sideOffset={16}
          alignOffset={0}
        >
          {/* Enhanced background effects */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-xl opacity-60"></div>
          <DropdownMenuLabel className="relative font-normal p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20 transition-all duration-300">
                <AvatarImage src={user?.profile} alt={user?.first_name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-bold text-lg">
                  {user?.first_name?.[0]}
                  {user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold leading-none bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Online
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          {/* Compact theme switcher */}
          <div className="px-4 py-2">
            <p className="text-sm font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
              Theme
            </p>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setTheme("light")}
                      className={cn(
                        "group h-auto relative py-3 px-0 bg-gradient-to-br from-card/50 to-card/30 border border-primary/20 rounded-xl",
                        "hover:shadow-md hover:from-yellow-500/10 hover:to-yellow-500/5 hover:border-yellow-500/30",
                        "transition-all duration-300",
                        theme === "light" &&
                          "ring-2 ring-yellow-400/30 from-yellow-500/15 to-yellow-500/5 border-yellow-500/40"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-300/10 flex items-center justify-center">
                          <Sun className="h-4 w-4 text-yellow-500" />
                        </div>
                        <span className="text-[11px] mt-1 font-medium">
                          Light
                        </span>
                        {theme === "light" && (
                          <div className="absolute -top-1 -right-1">
                            <BadgeCheck className="h-4 w-4 text-yellow-500" />
                          </div>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Light theme</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "group h-auto relative py-3 px-0 bg-gradient-to-br from-card/50 to-card/30 border border-primary/20 rounded-xl",
                        "hover:shadow-md hover:from-blue-500/10 hover:to-blue-500/5 hover:border-blue-500/30",
                        "transition-all duration-300",
                        theme === "dark" &&
                          "ring-2 ring-blue-400/30 from-blue-500/15 to-blue-500/5 border-blue-500/40"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-400/10 flex items-center justify-center">
                          <Moon className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-[11px] mt-1 font-medium">
                          Dark
                        </span>
                        {theme === "dark" && (
                          <div className="absolute -top-1 -right-1">
                            <BadgeCheck className="h-4 w-4 text-blue-500" />
                          </div>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Dark theme</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setTheme("system")}
                      className={cn(
                        "group h-auto relative py-3 px-0 bg-gradient-to-br from-card/50 to-card/30 border border-primary/20 rounded-xl",
                        "hover:shadow-md hover:from-primary/10 hover:to-primary/5 hover:border-primary/30",
                        "transition-all duration-300",
                        theme === "system" &&
                          "ring-2 ring-primary/30 from-primary/15 to-primary/5 border-primary/40"
                      )}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <div className="flex items-center justify-center relative">
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          </div>
                        </div>
                        <span className="text-[11px] mt-1 font-medium">
                          System
                        </span>
                        {theme === "system" && (
                          <div className="absolute -top-1 -right-1">
                            <BadgeCheck className="h-4 w-4 text-primary" />
                          </div>
                        )}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>System preference</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          {/* Profile and Settings */}
          <DropdownMenuItem
            className="justify-between"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex items-center gap-2">
              <MessageCircleMore />
              Chat Notification
            </div>
            <Switch
              checked={chatNotificationsEnabled}
              onCheckedChange={handleChatNotificationToggle}
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setDropdownOpen(false);
              profileModal.openModal();
            }}
          >
            <User />
            Account
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          {/* Logout option */}
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModal.isOpen}
        onClose={profileModal.closeModal}
      />
    </>
  );
}
