import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useCookies } from "react-cookie";
import api from "../../api";
import { useUser } from '../userContext/userContext';


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
    const {setUser} = useUser();

    //let baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    async function createUser(formData: LoginData) {
        try {
            let res = await api.post(`/users`, formData);
            setCookie('token', res.data.token);
        } catch (error) { //errors will be handled by the api middleware
        }
    }

    async function login(formData: LoginData) {
        try {
            let res = await api.post(`/users/login`, formData)
            setCookie('token', res.data.token);
        } catch (error) { //errors will be handled by the api middleware
        }
    }

    function logout() {        
        ['token'].forEach((cookie) => {
            removeCookie(cookie);
        });
        setUser(null);
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