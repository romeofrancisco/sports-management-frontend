import { AppSidebar } from "./app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router";
import { useFetchUser } from "@/hooks/useAuth";
import Loading from "@/components/common/FullLoading";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "@/utils/navigate";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { isLoading } = useFetchUser(); // Ensure user data is fetched before checking auth state
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  // Function to determine back link info based on current path
  const getBackLinkInfo = () => {
    const path = location.pathname;
    const pathParts = path.split('/').filter(Boolean);
    
    // No back link for root or dashboard
    if (pathParts.length === 0 || (pathParts.length === 1 && pathParts[0] === 'dashboard')) {
      return null;
    }
    
    // For any path with at least one segment, create a back link
    if (pathParts.length >= 1) {
      // Filter out numeric segments (IDs)
      const significantParts = [];
      
      for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        // Add non-numeric parts and their preceding numeric parts if they exist
        if (!isNumeric(part)) {
          significantParts.push(part);
        }
      }
      
      // Handle special cases for recognized resource types
      const currentResource = pathParts[pathParts.length - 1];
      const isDetailPage = pathParts.length >= 2 && isNumeric(pathParts[pathParts.length - 1]);
        // Handle special case for paths like /19/season/52 - go directly to seasons page
      if (pathParts.length >= 3 && 
          isNumeric(pathParts[0]) && 
          pathParts[1] === 'season' && 
          isNumeric(pathParts[2])) {
        return {
          text: 'Back to Seasons',
          link: '/seasons'
        };
      }
      
      // Handle the case for paths like /leagues/14/season/47
      if (pathParts.length >= 4 && 
          pathParts[0] === 'leagues' &&
          isNumeric(pathParts[1]) &&
          pathParts[2] === 'season' &&
          isNumeric(pathParts[3])) {
        // Return to the league details page
        return {
          text: 'Back to League',
          link: `/leagues/${pathParts[1]}`
        };
      }
      
      // Handle other nested resources
      if (pathParts.length >= 4 && 
          !isNumeric(pathParts[pathParts.length - 3]) && 
          isNumeric(pathParts[pathParts.length - 2])) {
        // Return to the resource type (e.g., 'leagues') instead of to the specific resource ID
        return {
          text: `Back to ${capitalize(pathParts[pathParts.length - 3])}`,
          link: `/${pathParts[pathParts.length - 3]}`
        };
      }
      
      // Handle the case for paths like /leagues/14
      if (isDetailPage) {
        const resourceType = pathParts[pathParts.length - 2];
        return {
          text: `Back to ${capitalize(resourceType)}`,
          link: `/${resourceType}`
        };
      }
      
      // Generate parent path - if current part is not numeric, go one level up
      let parentPathParts;
      if (isNumeric(currentResource)) {
        // If we're on an ID page, go back to the resource type
        parentPathParts = pathParts.slice(0, pathParts.length - 1);
      } else {
        // For non-ID pages, find the nearest parent that isn't an ID
        parentPathParts = [];
        let i = pathParts.length - 2; // Start from the parent of current segment
        while (i >= 0) {
          if (!isNumeric(pathParts[i])) {
            parentPathParts = pathParts.slice(0, i + 1);
            break;
          }
          i--;
        }
        
        // If all parents were IDs, go to root
        if (parentPathParts.length === 0) {
          return {
            text: 'Back to Dashboard',
            link: '/'
          };
        }
      }
      
      const parentPath = '/' + parentPathParts.join('/');
      
      // Generate back link text
      let text;
      if (parentPath === '/') {
        text = 'Back to Dashboard';
      } else {
        // Get the last non-ID segment of the parent path and capitalize it
        const lastSegment = parentPathParts[parentPathParts.length - 1];
        text = `Back to ${capitalize(lastSegment)}`;
      }
      
      return {
        text,
        link: parentPath
      };
    }
    
    return null;
  };
  
  // Helper function to check if a string is numeric
  const isNumeric = (str) => {
    return /^\d+$/.test(str);
  };
  
  // Helper function to capitalize first letter
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const backLinkInfo = getBackLinkInfo();

  if (isLoading)
    return (
      <div className="h-screen">
        <Loading />
      </div>
    );
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider className="relative overflow-x-hidden">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-auto shrink-0 items-center justify-between pe-4 gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            {backLinkInfo && (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                onClick={() => navigate(backLinkInfo.link)}
              >
                <ArrowLeft className="h-4 w-4" />
                {backLinkInfo.text}
              </Button>
            )}
          </div>
          <div>
            <ThemeToggle/>
          </div>
        </header>
        <div className="flex w-full max-w-full flex-1 flex-col gap-4 px-0 md:px-5 pt-0 overflow-x-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
