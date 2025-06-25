import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import { LucideIcon, Home, User, ClipboardCheck, TrendingUp, Users } from "lucide-react";

interface NavItem {
    id: string;
    icon: LucideIcon;
    label: string;
    path: string;
}

const BottomNavigation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const navItems: NavItem[] = [
        { id: "home", icon: Home, label: t("home"), path: "/dashboard" },
        { id: "recruitment", icon: ClipboardCheck, label: t("recruitment"), path: "/recruitment" },
        { id: "sales", icon: TrendingUp, label: t("sales"), path: "/sales" },
        { id: "employee", icon: Users, label: t("employee"), path: "/employee" },
        { id: "profile", icon: User, label: t("profile"), path: "/profile" },
    ];

    const isActive = (path: string) => {
        if (path === "/dashboard") return location.pathname === "/" || location.pathname === "/dashboard";
        return location.pathname.startsWith(path);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-white/95 backdrop-blur-lg rounded-t-xl shadow-2xl border border-gray-200/50">
                <div className="flex items-center justify-between px-2 py-2">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <motion.button
                                key={item.id}
                                onClick={() => navigate(item.path)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 flex-1 ${active ? "bg-blue-500 text-white shadow-lg" : "text-gray-600 hover:text-blue-500 hover:bg-blue-50"}`}
                                whileTap={{ scale: 0.95 }}
                                animate={{
                                    scale: active ? 1.05 : 1,
                                    // y: active ? -2 : 0
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <Icon size={20} className="mb-1" />
                                <span className="text-xs font-medium truncate w-full text-center">{item.label}</span>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomNavigation;
