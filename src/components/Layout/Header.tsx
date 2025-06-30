import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState, useRef, useEffect } from "react";

const Header: React.FC = () => {
    const { t } = useLanguage();

    const [isScrolled, setIsScrolled] = useState(false);

    const { user, logout } = useAuth();

    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const avatarDropdownRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target as Node)) {
                setShowAvatarMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogoutClick = () => {
        setShowAvatarMenu(false);

        Swal.fire({
            title: t("confirmLogout"),
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            denyButtonText: t("logout"),
            cancelButtonText: t("cancel"),
            reverseButtons: true,
        }).then(result => {
            if (result.isDenied) logout();
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const { theme } = useTheme();

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white/50 dark:bg-gray-900/50 shadow-md backdrop-blur-lg" : "bg-transparent border-none"}`}>
            <div className="flex items-center justify-between px-6 py-3 pt-10">
                <div className="flex items-center space-x-4">
                    <img src={theme === "dark" || isScrolled == false ? "img/dark-logo.png" : "img/light-logo.png"} alt="Logo" className="h-8 -mt-2" />
                </div>

                <div className="flex items-center space-x-1">
                    <div className="relative" ref={avatarDropdownRef}>
                        <button onClick={() => setShowAvatarMenu(!showAvatarMenu)} className={`p-1 rounded-full transition-colors duration-300 ${isScrolled ? "hover:bg-gray-100 dark:hover:bg-gray-800" : "hover:bg-white/20 backdrop-blur-sm"}`}>
                            <img
                                src={import.meta.env.VITE_PUBLIC_URL + "directorApp/avatars/" + user?.avatar}
                                alt="Avatar"
                                className={`w-8 h-8 object-cover rounded-full border-2 transition-colors duration-300 ${isScrolled ? "border-gray-300 dark:border-gray-400" : "border-white/50"} cursor-pointer`}
                                onError={e => {
                                    e.currentTarget.outerHTML = `<div class="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-500 dark:via-gray-600 dark:to-gray-700 border border-gray-300 dark:border-gray-400 rounded-full flex items-center justify-center text-white font-medium text-xs cursor-pointer">${user?.name.charAt(0)}</div>`;
                                }}
                            />
                        </button>

                        {showAvatarMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 min-w-[160px] z-50">
                                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                                </div>

                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setShowAvatarMenu(false);
                                            navigate("/profile");
                                        }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 text-gray-700 dark:text-gray-300"
                                    >
                                        <User size={16} className="text-gray-500 dark:text-gray-400" />
                                        <span className="text-sm">Profile</span>
                                    </button>

                                    <button onClick={handleLogoutClick} className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 text-red-600 dark:text-red-400">
                                        <LogOut size={16} className="text-red-500 dark:text-red-400" />
                                        <span className="text-sm">Logout</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
