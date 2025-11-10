import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  loginUser,
  logoutUser,
  fetchUser,
  setPassword,
  changePassword,
  forgotPassword,
  resetPassword,
} from "@/api/authApi";
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
      navigate("/");
      toast.success("Login Successful", {
        description: `Welcome back, ${data.first_name}!`,
        richColors: true,
      });
    },
    onError: (error) => {
      if (error.response.status === 400) {
        toast.error("Login Failed", {
          description: "Incorrect email or password",
          richColors: true,
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
      toast.info("Loggged out!", {
        richColors: true,
      });
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

export const useSetPassword = () => {
  return useMutation({
    mutationFn: (passwordData) => setPassword(passwordData),
    onSuccess: () => {
      toast.success("Password set successfully!", {
        description: "You can now log in with your new password.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to set password", {
        description:
          error.message || "An error occurred while setting the password.",
        richColors: true,
      });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (passwordData) => changePassword(passwordData),
    onSuccess: () => {
      toast.success("Password changed successfully!", {
        description: "You can now log in with your new password.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to change password", {
        description:
          error.response.data.error ||
          "An error occurred while changing the password.",
        richColors: true,
      });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (emailData) => forgotPassword(emailData),
    onSuccess: () => {
      toast.success("Password reset email sent!", {
        description: "Please check your inbox for further instructions.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to send password reset email", {
        description:
          error.response.data.error ||
          "An error occurred while sending the email.",
        richColors: true,
      });
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (resetData) => resetPassword(resetData),
    onSuccess: () => {
      toast.success("Password reset successfully!", {
        description: "You can now log in with your new password.",
        richColors: true,
      });
    },
    onError: (error) => {
      toast.error("Failed to reset password", {
        description:
          error.response.data.error ||
          "An error occurred while resetting the password.",
        richColors: true,
      });
    },
  });
};
