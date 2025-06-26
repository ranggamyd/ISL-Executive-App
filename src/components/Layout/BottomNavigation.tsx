import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LucideIconMap } from "@/utils/dynamicIcon";
import { motion } from "framer-motion";
import { Menu } from "@/types/menu";

const BottomNavigation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { menus } = useAuth() as { menus: Menu[] };
    const { t } = useLanguage();

    const groupMenus = useMemo(() => {
        const grouped: Record<string, { group: string; icon: string; theme?: string }> = {};

        menus?.forEach(menu => {
            const key = menu.group;
            if (!grouped[key]) {
                grouped[key] = {
                    group: key,
                    icon: menu.groupIcon || menu.icon,
                    theme: menu.theme || "gray",
                };
            }
        });

        return Object.values(grouped).slice(0, 3);
    }, [menus]);

    const isActive = (path: string) => {
        if (path === "/dashboard") return location.pathname === "/" || location.pathname === "/dashboard";
        return location.pathname.startsWith(path);
    };

    const renderButton = (key: string, iconName: string, label: string, path: string, activeCheckPath?: string) => {
        const active = isActive(activeCheckPath || path);
        const Icon = LucideIconMap[iconName as keyof typeof LucideIconMap] as React.ElementType;

        if (!Icon) return null;

        return (
            <button key={key} onClick={() => navigate(path)} className="flex-1 flex flex-col items-center justify-center relative py-2 overflow-hidden">
                {active && (
                    <>
                        <motion.span layoutId="active-indicator" className="absolute top-0 w-full h-1 bg-blue-500 dark:bg-blue-400 rounded-b-md z-30" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 pointer-events-none bg-gradient-to-b from-blue-200/50 dark:from-blue-800/50 via-blue-200/10 dark:via-blue-800/10 to-transparent blur-sm" />
                    </>
                )}

                <div className="relative z-20 flex flex-col items-center justify-center pt-1">
                    <Icon size={20} className={`mb-1 ${active ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-500"} transition-colors duration-200`} />
                    <span className={`text-xs font-medium ${active ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"} transition-colors duration-200`}>{label}</span>
                </div>
            </button>
        );
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-10">
            <div className="bg-white dark:bg-gray-800 pb-1 border-t border-gray-200 dark:border-gray-700 shadow-md rounded-t-xl">
                <div className="flex items-center justify-between px-2">
                    {renderButton("home", "Home", t("home"), "/dashboard")}
                    {groupMenus.map(menu => renderButton(menu.group, menu.icon, t(menu.group), `/${menu.group}`))}
                    {renderButton("profile", "User", t("profile"), "/profile")}
                </div>
            </div>
        </div>
    );
};

export default BottomNavigation;