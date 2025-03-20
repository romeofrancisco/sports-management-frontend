import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/api/authApi";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: async () => {
      queryClient.clear();
      dispatch(logout());
      navigate("/login", { replace: true });
    },
  });
};
