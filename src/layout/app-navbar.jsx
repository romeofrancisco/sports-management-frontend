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
import { Menu, ChevronDown, ChevronRight, Sun, Moon } from "lucide-react";
import { useSelector } from "react-redux";
import { NavbarNavUser } from "./navbar-nav-user";
import { NavbarMessages } from "@/components/chat";
import { useNavigate } from "react-router-dom";
import { useModal } from "@/hooks/useModal";
import logo from "/perpetual_logo.png";
import NavbarNotifications from "@/features/notifications/NavbarNotifications";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/context/ThemeProvider";

const AppNavbar = ({ navItems = [] }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCollapsibles, setOpenCollapsibles] = useState(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();

  // Check if we're on the homepage
  const isHomePage = location.pathname === "/";

  // Handle scroll event for transparent header on homepage and section tracking
  useEffect(() => {
    const handleScroll = () => {
      // Show background after scrolling past hero section (approximately 100px)
      setIsScrolled(window.scrollY > 0);

      // Track active section for homepage navigation
      if (isHomePage && !isAuthenticated) {
        const sections = ["home", "about", "features", "sports", "contact"];
        const scrollPosition = window.scrollY + 100; // Offset for navbar height

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (
              scrollPosition >= offsetTop &&
              scrollPosition < offsetTop + offsetHeight
            ) {
              setActiveSection(sectionId);
              break;
            }
          }
        }

        // If at the very top, set home as active
        if (window.scrollY < 100) {
          setActiveSection("home");
        }
      }
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    } else {
      // Reset scroll state when not on homepage
      setIsScrolled(true);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage, isAuthenticated]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Allow certain public routes (like set-password) to be accessed
      // without forcing a redirect to login. This prevents the app from
      // redirecting when visiting routes such as `/set-password/:uuid/:token`.
      const publicPrefixes = [
        "/login",
        "/set-password",
        "/forgot-password",
        "/reset-password",
        "/privacy-policy",
        "/signup",
        "/",
      ];
      const pathname = location.pathname || "";
      const isPublic = publicPrefixes.some(
        (p) => pathname === p || pathname.startsWith(p + "/")
      );
      if (!isPublic && isAuthenticated) {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, location]);

  const isActive = (href) => {
    if (href === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname.startsWith("/dashboard/")
      );
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

    if (!isAuthenticated) {
      // Extract section id from href (e.g., "/#features" -> "features")
      const sectionId = item.href?.replace("/#", "") || "home";
      // Only show active section styling when on homepage
      const isActiveSectionStyle = isHomePage && activeSection === sectionId;

      const handleClick = (e) => {
        e.preventDefault();
        const targetId = item.href?.replace("/#", "");

        if (isHomePage) {
          // If on homepage, scroll to section
          if (targetId) {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            } else if (targetId === "" || item.href === "/#") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }
        } else {
          // If on another page, navigate to homepage with hash
          navigate("/" + (targetId ? `#${targetId}` : ""));
        }
      };

      return (
        <a
          key={index}
          href={item.href}
          onClick={handleClick}
          className={cn(
            "relative px-1 py-2 text-sm font-medium transition-colors duration-300",
            "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full",
            "after:origin-center after:scale-x-0 after:transition-transform after:duration-300",
            isTransparentMode
              ? "after:bg-secondary dark:after:bg-primary"
              : "after:bg-primary",
            isActiveSectionStyle && "after:scale-x-100",
            isTransparentMode
              ? isActiveSectionStyle
                ? "text-secondary dark:text-primary"
                : "text-primary-foreground hover:text-secondary dark:hover:text-primary"
              : isActiveSectionStyle
              ? "text-primary"
              : "text-foreground hover:text-primary"
          )}
        >
          {item.title}
        </a>
      );
    }

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
              "group h-10 px-4 py-2 bg-gradient-to-r from-background/80 to-background/60 border border-border/50 hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 hover:shadow-md hover:scale-[1.02]",
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

    // For public navigation (no icons, section links)
    if (!isAuthenticated) {
      const sectionId = item.href?.replace("/#", "") || "home";
      const isActiveSectionStyle = isHomePage && activeSection === sectionId;

      const handleClick = (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const targetId = item.href?.replace("/#", "");

        if (isHomePage) {
          if (targetId) {
            const element = document.getElementById(targetId);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }
        } else {
          navigate("/" + (targetId ? `#${targetId}` : ""));
        }
      };

      return (
        <a
          key={item.title}
          href={item.href}
          onClick={handleClick}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-all duration-300",
            "bg-gradient-to-r from-card/50 to-card/30 border border-border/30",
            "hover:from-primary/10 hover:to-primary/5 hover:border-primary/30 hover:shadow-md",
            isActiveSectionStyle &&
              "from-primary/20 to-primary/10 border-primary/50 shadow-md"
          )}
        >
          <span className="font-medium text-sm">{item.title}</span>
        </a>
      );
    }

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
                {IconComponent && (
                  <IconComponent className="h-5 w-5 transition-all duration-300" />
                )}
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
                  {SubIconComponent && <SubIconComponent className="h-4 w-4" />}
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
        {IconComponent && <IconComponent className="h-5 w-5" />}
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
          className={
            isAuthenticated
              ? "lg:hidden h-10 w-10 bg-gradient-to-r from-background/80 to-background/60 border border-border/50 hover:from-primary/10 hover:to-primary/5 hover:border-primary/30"
              : isTransparentMode ? "text-primary-foreground" : "text-foreground"
          }
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

  // Determine if navbar should be transparent
  const isTransparentMode = isHomePage && !isAuthenticated && !isScrolled;

  return (
    <header
      className={cn(
        "fixed h-16 top-0 left-0 right-0 px-4 md:px-6 z-50 w-full transition-all duration-300",
        isTransparentMode
          ? "bg-transparent"
          : "bg-background/90 backdrop-blur-sm shadow-sm"
      )}
    >
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
              <div
                className={cn(
                  "font-bold text-lg bg-clip-text text-transparent transition-all duration-300",
                  isTransparentMode
                    ? "bg-gradient-to-r from-white to-white/90 dark:from-primary dark:to-primary/90"
                    : "bg-gradient-to-r from-primary to-primary/70"
                )}
              >
                Sports Management
              </div>
              <div
                className={cn(
                  "text-xs font-medium transition-all duration-300",
                  isTransparentMode ? "text-white/70" : "text-muted-foreground"
                )}
              >
                University of Perpetual Help System DALTA
              </div>
            </div>
          </Link>
        </div>
        {/* Center - Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList className={!isAuthenticated ? "gap-8" : "gap-2"}>
            {navItems.map(renderDesktopNavItem)}
          </NavigationMenuList>
        </NavigationMenu>
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <NavbarMessages />
                <NavbarNotifications />
              </div>

              <div className="hidden xl:block text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>

              <NavbarNavUser />
            </div>
          </>
        ) : location.pathname === "/" ? (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className={cn(
                "text-sm font-medium hover:underline transition-colors duration-300",
                isTransparentMode
                  ? "text-white hover:text-secondary"
                  : "text-primary"
              )}
            >
              Login
            </Link>
            <Separator
              orientation="vertical"
              className={cn(
                "min-h-6 transition-colors duration-300",
                isTransparentMode ? "bg-white/30" : ""
              )}
            />
            <Button
              size="sm"
              className={cn(
                "cursor-pointer transition-all duration-300",
                isTransparentMode
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80"
                  : ""
              )}
              asChild
            >
              <Link to="/signup">Register as Player</Link>
            </Button>
            <div
              className={` ${
                isTransparentMode
                  ? "text-primary-foreground"
                  : "text-foreground"
              }`}
            >
              {theme === "light" ? (
                <Sun className="size-5" onClick={() => setTheme("dark")} />
              ) : (
                <Moon className="size-5" onClick={() => setTheme("light")} />
              )}
            </div>
          </div>
        ) : (
          <div
            className={`lg:ml-61 ${
              isTransparentMode ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {theme === "light" ? (
              <Sun className="size-5" onClick={() => setTheme("dark")} />
            ) : (
              <Moon className="size-5" onClick={() => setTheme("light")} />
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default AppNavbar;
