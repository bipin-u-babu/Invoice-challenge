import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import { fetchUser } from "./userApi";

type AuthContextType = {
  userId: string | null;
  role: string | null;
  loading: boolean;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  userId: null,
  role: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if userId exists in URL
    const paramUserId = searchParams.get("userId");
    const resolvedUserId = paramUserId || "1"; // fallback to user id 1

    setUserId(resolvedUserId);

    // Fetch role based on userId
    const fetchUserRole = async () => {
      try {
        const res = await fetchUser(resolvedUserId);

        if (res?.includes("ADMIN")) {
          setRole("ADMIN");
          setIsAdmin(true);
        } else {
          setRole("USER");
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [searchParams]);
  return (
    <AuthContext.Provider value={{ userId, role, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
