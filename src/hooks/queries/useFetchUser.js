import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "@/api/authApi";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/slices/authSlice";
import { useEffect } from "react";

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
