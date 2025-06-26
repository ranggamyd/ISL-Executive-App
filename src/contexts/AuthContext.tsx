import API from "@/lib/api";
import swal from "@/utils/swal";
import { User } from "@/types/user";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Menu } from "@/types/menu";

interface Permission {
    menu: string;
    access: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    menus: Menu[] | null;
    permissions: Permission[] | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
    refresh: () => Promise<void>;
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
    const [token, setToken] = useState(null);
    const [menus, setMenus] = useState<Menu[] | null>(null);
    const [permissions, setPermissions] = useState<Permission[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        const savedMenus = localStorage.getItem("menus");
        const savedPermissions = localStorage.getItem("permissions");

        if (savedUser && savedToken && savedMenus && savedPermissions) {
            setUser(JSON.parse(savedUser));
            setToken(JSON.parse(savedToken));
            setMenus(JSON.parse(savedMenus));
            setPermissions(JSON.parse(savedPermissions));
        }

        setLoading(false);
    }, []);

    const login = async (credential: string, password: string): Promise<boolean> => {
        // setLoading(true);

        try {
            const response = await API.post("login", { credential, password });

            const responseData = response.data.data;

            setUser(responseData.user);
            setToken(responseData.token);
            setMenus(responseData.menus);
            setPermissions(responseData.permissions);

            localStorage.setItem("user", JSON.stringify(responseData.user));
            localStorage.setItem("token", JSON.stringify(responseData.token));
            localStorage.setItem("menus", JSON.stringify(responseData.menus));
            localStorage.setItem("permissions", JSON.stringify(responseData.permissions));

            swal("success", response.data.message);

            return true;
        } catch (err: any) {
            swal("error", err.response.data.message);

            return false;
        } finally {
            // setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);

        try {
            const response = await API.post("logout");

            const responseData = response.data;

            setUser(null);
            setToken(null);
            setMenus(null);
            setPermissions(null);

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("menus");
            localStorage.removeItem("permissions");

            swal("success", responseData.message);

            return true;
        } catch (err: any) {
            swal("error", err.response.data.message);

            return false;
        } finally {
            setLoading(false);
        }
    };

    const refresh = async () => {
        const savedToken = localStorage.getItem("token");
        if (!savedToken) return;

        try {
            const response = await API.get("profile/me");

            const responseData = response.data.data;

            setUser(responseData.user);
            setMenus(responseData.menus);
            setPermissions(responseData.permissions);

            localStorage.setItem("user", JSON.stringify(responseData.user));
            localStorage.setItem("menus", JSON.stringify(responseData.menus));
            localStorage.setItem("permissions", JSON.stringify(responseData.permissions));
        } catch (err: any) {
            swal("error", err.response.data.message);
        }
    };

    return <AuthContext.Provider value={{ user, token, menus, permissions, loading, login, logout, isAuthenticated: !!user, refresh }}>{children}</AuthContext.Provider>;
};
