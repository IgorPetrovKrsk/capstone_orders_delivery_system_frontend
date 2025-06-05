import { createContext, useContext, useState, type ReactNode } from "react";

type UserRole = "admin" | "dispatcher" | "driver";

interface User {
  username: string;
  role: UserRole;
  truck?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
}


export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}