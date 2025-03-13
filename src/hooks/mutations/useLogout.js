import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/api/authApi";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      dispatch(logout());
      navigate("/login");
    },
  });
};
