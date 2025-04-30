import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

const useNavigateWithUserId = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();

  const navigateWithUserId = (to: string, options?: any) => {
    const url = new URL(to, window.location.origin);
    url.searchParams.set("userId", userId || "");
    const relativePath = url.pathname + url.search;
    navigate(relativePath, options);
  };

  return navigateWithUserId;
};

export default useNavigateWithUserId;
