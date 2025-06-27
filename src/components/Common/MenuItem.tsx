import { useLanguage } from "@/contexts/LanguageContext";
import { Menu as MenuType } from "@/types/menu";
import { LucideIconMap } from "@/utils/dynamicIcon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import MenuDrawer from "../Layout/MenuDrawer";
import { useState } from "react";

const themeClasses = {
    blue: {
        background: "bg-blue-50 dark:bg-blue-800",
        border: "border-blue-200/50 dark:border-blue-700",
        icon: "text-blue-600 dark:text-blue-400",
        textHover: "group-hover:text-blue-700 dark:group-hover:text-blue-400",
    },
    red: {
        background: "bg-red-50 dark:bg-red-800",
        border: "border-red-200/50 dark:border-red-700",
        icon: "text-red-600 dark:text-red-400",
        textHover: "group-hover:text-red-700 dark:group-hover:text-red-400",
    },
    green: {
        background: "bg-green-50 dark:bg-green-800",
        border: "border-green-200/50 dark:border-green-700",
        icon: "text-green-600 dark:text-green-400",
        textHover: "group-hover:text-green-700 dark:group-hover:text-green-400",
    },
    purple: {
        background: "bg-purple-50 dark:bg-purple-800",
        border: "border-purple-200/50 dark:border-purple-700",
        icon: "text-purple-600 dark:text-purple-400",
        textHover: "group-hover:text-purple-700 dark:group-hover:text-purple-400",
    },
    yellow: {
        background: "bg-yellow-50 dark:bg-yellow-800",
        border: "border-yellow-200/50 dark:border-yellow-700",
        icon: "text-yellow-600 dark:text-yellow-400",
        textHover: "group-hover:text-yellow-700 dark:group-hover:text-yellow-400",
    },
    orange: {
        background: "bg-orange-50 dark:bg-orange-800",
        border: "border-orange-200/50 dark:border-orange-700",
        icon: "text-orange-600 dark:text-orange-400",
        textHover: "group-hover:text-orange-700 dark:group-hover:text-orange-400",
    },
    gray: {
        background: "bg-gray-50 dark:bg-gray-800",
        border: "border-gray-200/50 dark:border-gray-600",
        icon: "text-gray-600 dark:text-gray-400",
        textHover: "group-hover:text-gray-700 dark:group-hover:text-gray-400",
    },
};

export type ThemeName = keyof typeof themeClasses;

export const MenuItemCard = ({ index, menu }: { index: number; menu: MenuType }) => {
    const { t } = useLanguage();

    const navigate = useNavigate();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const theme = themeClasses[menu.theme as ThemeName] || themeClasses.gray;

    const iconName = menu.icon as keyof typeof LucideIconMap;
    const Icon = LucideIconMap[iconName] as React.ElementType;

    return (
        <>
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="group flex flex-col items-center justify-center gap-1 p-1 rounded-2xl shadow-sm"
                onClick={() => {
                    if (menu.id === "allMenus") {
                        setIsDrawerOpen(true);
                    } else {
                        navigate(`/${menu.path}`);
                    }
                }}
            >
                <div className={`flex p-1 items-end justify-end w-10 h-10 rounded-lg ${theme.background} shadow-sm transition-all duration-300 ${theme.border}`}>
                    <span className="transition-all duration-300 group-hover:[transform:translate(-2px,-2px)_scale(1.1)]">
                        <Icon size={21} className={`transition-all duration-300 [filter:drop-shadow(0_1.2px_0.5px_rgb(0_0_0/0.2))] dark:[filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.5))_drop-shadow(0_-0.8px_0.3px_rgb(255_255_255/0.25))] ${theme.icon}`} strokeWidth={2} />
                    </span>
                </div>
                <p className={`text-xs font-semibold text-center text-gray-600 dark:text-gray-300 transition-all duration-300 truncate w-full ${theme.textHover}`}>{t(menu.name)}</p>
            </motion.button>

            <MenuDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </>
    );
};

export const MenuItemList = ({ index, menu }: { index: number; menu: MenuType }) => {
    const { t } = useLanguage();

    const navigate = useNavigate();

    const theme = themeClasses[menu.theme as ThemeName] || themeClasses.gray;

    const iconName = menu.icon as keyof typeof LucideIconMap;
    const Icon = LucideIconMap[iconName] as React.ElementType;

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="group flex flex-row items-center justify-start gap-4 p-1 rounded-2xl shadow-sm w-full"
            onClick={() => {
                navigate(`/${menu.path}`);
            }}
        >
            <div className={`flex p-1 items-end justify-end w-11 h-10 rounded-lg ${theme.background} shadow-sm transition-all duration-300 ${theme.border}`}>
                <span className="transition-all duration-300 group-hover:[transform:translate(-2px,-2px)_scale(1.1)]">
                    <Icon size={21} className={`transition-all duration-300 [filter:drop-shadow(0_1.2px_0.5px_rgb(0_0_0/0.2))] dark:[filter:drop-shadow(0_1px_1px_rgb(0_0_0/0.5))_drop-shadow(0_-0.8px_0.3px_rgb(255_255_255/0.25))] ${theme.icon}`} strokeWidth={2} />
                </span>
            </div>
            <p className={`text-xs font-semibold text-start text-gray-600 dark:text-gray-300 transition-all duration-300 truncate w-full ${theme.textHover}`}>{t(menu.name)}</p>
        </motion.button>
    );
};
