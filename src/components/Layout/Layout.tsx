import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";
import BottomNavigation from "./BottomNavigation";

export const Layout: React.FC = () => {
    const { user } = useAuth();

    const location = useLocation();

    if (!user || location.pathname.includes("/auth")) return <Outlet />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="ISL Executive App" />

            <main className="pb-32 pt-0">
                <Outlet />
            </main>

            <BottomNavigation />
        </div>
    );
};
