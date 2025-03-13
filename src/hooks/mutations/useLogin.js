import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "@/api/authApi";
import { login } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData) => loginUser(formData),
    onSuccess: (data) => {
      dispatch(login(data));
      navigate("/")
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
