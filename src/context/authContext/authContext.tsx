import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContextType {
    cookies: any;
    createUser: (formData: any) => Promise<void>;
    login: (formData: any) => Promise<void>;
    logout: () => void;
}

interface LoginData {
    username: string;
    password: string;
}


const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
    const [cookies, setCookie, removeCookie] = useCookies();

    let baseUrl = import.meta.env.BASE_URL;

    async function createUser(formData: LoginData) {
        let res = await axios.post(`${baseUrl}/users`, formData);
        setCookie('x-auth-token', res.data.token);
    }

    async function login(formData: LoginData) {
        let res = await axios.post(`${baseUrl}/users/login`, formData)
        setCookie('x-auth-token', res.data.token);
    }

    function logout() {
        ['token'].forEach((cookie) => {
            removeCookie(cookie);
        })
    }

    const value = useMemo(() => ({
        cookies,
        createUser,
        login,
        logout
    }), [cookies])

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>

}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;

}