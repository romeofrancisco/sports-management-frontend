import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginUser } from "@/api/authApi";
import { login } from "@/store/slices/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";

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
