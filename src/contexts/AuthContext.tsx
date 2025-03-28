import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  UserRole,
  getCurrentUser,
  signIn,
  signOut,
  register,
} from "../services/auth";

interface AuthContextType {
  currentUser: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<User>;
  logout: () => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    role: UserRole,
  ) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        setUserRole(user?.role || null);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, role: string) => {
    setIsLoading(true);
    try {
      const user = await signIn(email, password);
      setCurrentUser(user);
      setUserRole(user.role || null);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut();
      setCurrentUser(null);
      setUserRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    role: UserRole,
  ) => {
    setIsLoading(true);
    try {
      const user = await register(email, password, role);
      setCurrentUser(user);
      setUserRole(role);
      return user;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    userRole,
    isLoading,
    login,
    logout,
    registerUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
