import type { ReactNode } from "react";
import AuthProvider from "../authContext/authContext"

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({children}:AppProviderProps){
    return <AuthProvider>{children}</AuthProvider>
}