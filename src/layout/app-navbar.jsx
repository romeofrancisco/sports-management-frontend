import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { NavbarNavUser } from "./navbar-nav-user";
import { NavbarMessages } from "@/components/chat";
import { useNavigate } from "react-router-dom";
import logo from "/perpetual_logo.png";

const AppNavbar = ({ navItems = [] }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCollapsibles, setOpenCollapsibles] = useState(new Set());
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const isActive = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const toggleCollapsible = (title) => {
    const newOpenCollapsibles = new Set(openCollapsibles);
    if (newOpenCollapsibles.has(title)) {
      newOpenCollapsibles.delete(title);
    } else {
      newOpenCollapsibles.add(title);
    }
    setOpenCollapsibles(newOpenCollapsibles);
  };

  const renderDesktopNavItem = (item, index) => {
    const IconComponent = item.icon;
    const active = item.href ? isActive(item.href) : false;

    if (item.items && item.items.length > 0) {
      // Dropdown menu for items with children
      return (
        <NavigationMenuItem key={item.title}>
          <NavigationMenuTrigger
            className={cn(
              "group h-10 px-4 py-2 bg-gradient-to-r from-background/80 to-background/60 border border-border/50",
              "hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 hover:shadow-md",
              "data-[state=open]:from-primary/20 data-[state=open]:to-primary/10 data-[state=open]:border-primary/40",
              "transition-all duration-300 ease-out backdrop-blur-sm",
              active &&
                "from-primary/15 to-primary/5 border-primary/40 shadow-sm"
            )}
          >
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-data-[state=open]:rotate-12" />
              <span className="font-medium">{item.title}</span>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5 text-xs bg-gradient-to-r from-secondary/80 to-secondary/60"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[500px] gap-3 p-6 md:w-[600px] md:grid-cols-2">
              {item.items.map((subItem) => {
                const SubIconComponent = subItem.icon;
                return (
                  <NavigationMenuLink key={subItem.title} asChild>
                    <Link
                      to={subItem.href}
                      className={cn(
                        "group block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-300",
                        "bg-gradient-to-br from-card/50 to-card/30 border border-border/30",
                        "hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 hover:shadow-lg hover:scale-[1.02]",
                        "focus:from-primary/15 focus:to-primary/10 focus:border-primary/40",
                        isActive(subItem.href) &&
                          "from-primary/20 to-primary/10 border-primary/50 shadow-md"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center text-sm font-medium leading-none">
                        <SubIconComponent className="mr-3 h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                        <span>{subItem.title}</span>
                        {subItem.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-4 px-1.5 text-xs"
                          >
                            {subItem.badge}
                          </Badge>
                        )}
                      </div>
                      {subItem.description && (
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-2">
                          {subItem.description}
                        </p>
                      )}
                    </Link>
                  </NavigationMenuLink>
                );
              })}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      );
    }

    // Single navigation item
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuLink asChild>
          <Link
            to={item.href}
            className={cn(
              navigationMenuTriggerStyle(),
              "group h-10 px-4 py-2 bg-gradient-to-r from-background/80 to-background/60 border border-border/50",
              "hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 hover:shadow-md hover:scale-[1.02]",
              "transition-all duration-300 ease-out backdrop-blur-sm",
              active &&
                "from-primary/20 to-primary/10 border-primary/50 shadow-md scale-[1.02]"
            )}
          >
            <div className="flex items-center gap-2">
              <IconComponent className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
              <span className="font-medium">{item.title}</span>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5 text-xs bg-gradient-to-r from-secondary/80 to-secondary/60"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    );
  };

  const renderMobileNavItem = (item) => {
    const IconComponent = item.icon;
    const active = item.href ? isActive(item.href) : false;
    const isOpen = openCollapsibles.has(item.title);

    if (item.items && item.items.length > 0) {
      return (
        <Collapsible
          key={item.title}
          open={isOpen}
          onOpenChange={() => toggleCollapsible(item.title)}
          className="space-y-2"
        >
          <CollapsibleTrigger className="w-full">
            <div
              className={cn(
                "flex items-center justify-between w-full p-3 rounded-lg transition-all duration-300",
                "bg-gradient-to-r from-card/50 to-card/30 border border-border/30",
                "hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 hover:shadow-md",
                active &&
                  "from-primary/15 to-primary/5 border-primary/40 shadow-sm"
              )}
            >
              <div className="flex items-center gap-3">
                <IconComponent className="h-5 w-5 transition-all duration-300" />
                <span className="font-medium text-sm">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 transition-transform duration-300" />
              ) : (
                <ChevronRight className="h-4 w-4 transition-transform duration-300" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-4">
            {item.items.map((subItem) => {
              const SubIconComponent = subItem.icon;
              return (
                <Link
                  key={subItem.title}
                  to={subItem.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
                    "bg-gradient-to-r from-muted/30 to-muted/20 border border-border/20",
                    "hover:from-primary/8 hover:to-primary/4 hover:border-primary/20 hover:shadow-sm",
                    isActive(subItem.href) &&
                      "from-primary/15 to-primary/8 border-primary/30 shadow-sm"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <SubIconComponent className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {subItem.title}
                      </span>
                      {subItem.badge && (
                        <Badge
                          variant="secondary"
                          className="h-4 px-1.5 text-xs"
                        >
                          {subItem.badge}
                        </Badge>
                      )}
                    </div>
                    {subItem.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {subItem.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link
        key={item.title}
        to={item.href}
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
          "bg-gradient-to-r from-card/50 to-card/30 border border-border/30",
          "hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 hover:shadow-md",
          active && "from-primary/20 to-primary/10 border-primary/50 shadow-md"
        )}
        onClick={() => setMobileMenuOpen(false)}
      >
        <IconComponent className="h-5 w-5" />
        <span className="font-medium text-sm">{item.title}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto h-4 px-1.5 text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  const MobileNav = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-10 w-10 bg-gradient-to-r from-background/80 to-background/60 border border-border/50 hover:from-primary/10 hover:to-primary/5 hover:border-primary/30"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[320px] sm:w-[400px] bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-xl border-r-2 border-border/50"
      >
        <SheetHeader className="pb-6">
          <SheetTitle className="text-left font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Navigation Menu
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="space-y-3">{navItems.map(renderMobileNavItem)}</div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky h-16 top-0 px-4 md:px-6 z-50 w-full border-b-2 border-primary/20 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50"></div>
      <div className="absolute top-0 left-1/4 w-32 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container relative flex h-16 items-center justify-between">
        {/* Left side - Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <MobileNav />
          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            <img src={logo} alt="UPHSD" className="w-7" />
            <div className="hidden sm:inline-block">
              <div className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Sports Management
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                University of Perpetual Help System DALTA
              </div>
            </div>
          </Link>
        </div>

        {/* Center - Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className="gap-2">
            {navItems.map(renderDesktopNavItem)}
          </NavigationMenuList>
        </NavigationMenu>        {/* Right side - Messages and User menu */}
        <div className="flex items-center gap-4">
          {/* Messages dropdown */}
          <NavbarMessages />
          
          {/* Welcome message for larger screens */}
          <div className="hidden xl:block text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {user?.first_name} {user?.last_name}
            </span>
          </div>

          <NavbarNavUser />
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
