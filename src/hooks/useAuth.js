import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser, logoutUser, fetchUser } from "@/api/authApi";
import { login, logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { queryClient } from "@/context/QueryProvider";
import { useEffect } from "react";
import { persistor } from "@/store";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData) => loginUser(formData),
    onSuccess: (data) => {
      dispatch(login(data));
      navigate("/")
      toast.success("Login Successful",{
        description: `Welcome back, ${data.first_name}!`,
        richColors: true
      });
    },
    onError: (error) => {
      if (error.response.status === 400) {
        toast.error("Login Failed",{
          description: "Incorrect email or password",
          richColors: true
        });
      }
    },
  });
};


export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      try {
        // Clear persistence first
        await persistor.purge();
        
        // Then clear queries and state
        queryClient.clear();
        dispatch(logout());
        
        // Navigate AFTER cleanup
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  });
};

export const useFetchUser = () => {
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
    onError: (error) => {
      if (error.response?.status === 401) {
        dispatch(logout()); // Handle logout if refresh fails
      }
    },
  });

  useEffect(() => {
    if (query.data) {
      dispatch(login(query.data));
    }
  }, [query.data, dispatch]);

  return query;
};