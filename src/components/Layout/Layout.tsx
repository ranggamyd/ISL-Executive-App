import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

export const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
            <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-br from-blue-600 via-blue-400 to-purple-600 dark:from-blue-800 dark:via-blue-600 dark:to-purple-800" />
            <div className="absolute top-0 left-0 right-0 h-72 bg-gradient-to-r from-transparent via-white/10 to-transparent z-[1]" />
            <div className="absolute top-48 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900 z-[1]" />

            <div className="relative z-10">
                <Header title="ISL Executive App" />

                <main className="pb-12 pt-0">
                    <Outlet />
                </main>

                <BottomNavigation />
            </div>
        </div>
    );
};