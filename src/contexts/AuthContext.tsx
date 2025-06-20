import API from "@/lib/api";
import swal from "@/utils/swal";
import { User } from "@/types/user";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    resetPassword: (email: string) => Promise<boolean>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");

    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        if (savedUser && savedToken) setUser(JSON.parse(savedUser));

        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setLoading(true);

        try {
            const response = await API.post("login", {
                email,
                password,
            });

            const responseData = response.data;

            setUser(responseData.user);
            localStorage.setItem("user", JSON.stringify(responseData.user));
            localStorage.setItem("token", JSON.stringify(responseData.token));

            swal("success", responseData.message);

            return true;
        } catch (err: any) {
            swal("error", err.response.data.message);

            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);

        try {
            const response = await API.post("logout");

            const responseData = response.data;

            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");

            swal("success", responseData.message);

            return true;
        } catch (err: any) {
            swal("error", err.response.data.message);

            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    };

    return <AuthContext.Provider value={{ user, loading, login, logout, resetPassword, isAuthenticated: !!user }}>{children}</AuthContext.Provider>;
};
