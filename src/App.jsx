import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import Loading from "@/components/Loading";
import { useFetchUser } from "@/hooks/queries/useFetchUser";

const App = () => {
  const { isLoading } = useFetchUser();
  
  if (isLoading) {
    return <Loading />;
  }

  return <RouterProvider router={router} />;
};

export default App;
