import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, User } from "../types/Auth";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = ({ token, user }: { token: string; user: User }) => {
        localStorage.setItem('userToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        setToken(token);
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setToken(null);
        setUser(null);
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("userToken");
        const storedUser = localStorage.getItem("userData");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setIsAuthenticated(true);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, logout, login, isAuthenticated }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within the AuthProvider");
    return ctx;
}

