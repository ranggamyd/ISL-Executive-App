import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SimpleThemeToggle } from "../Common/ThemeToggle";
import React, { useState, useRef, useEffect } from "react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";

interface HeaderProps {
    title: string;
    showBack?: boolean;
    onMenuClick?: () => void;
}

const languages = [
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "id" as Language, name: "Indonesia", flag: "🇮🇩" },
    { code: "zh" as Language, name: "中文", flag: "🇨🇳" },
];

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { t } = useLanguage();

    const { user, logout } = useAuth();
    const { language, setLanguage } = useLanguage();

    const [showLangMenu, setShowLangMenu] = useState(false);
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);

    const avatarDropdownRef = useRef<HTMLDivElement | null>(null);
    const langDropdownRef = useRef<HTMLDivElement | null>(null);

    const [isScrolled, setIsScrolled] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target as Node)) {
                setShowAvatarMenu(false);
            }
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setShowLangMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLanguageMenuToggle = () => {
        setShowLangMenu(!showLangMenu);
        if (showAvatarMenu) {
            setShowAvatarMenu(false);
        }
    };

    const handleAvatarMenuToggle = () => {
        setShowAvatarMenu(!showAvatarMenu);
        if (showLangMenu) {
            setShowLangMenu(false);
        }
    };

    const handleProfileClick = () => {
        setShowAvatarMenu(false);
        navigate("/profile");
    };

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
            setIsScrolled(window.scrollY > 10); // bisa disesuaikan threshold-nya
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white/75 dark:bg-gray-800/95 shadow-md backdrop-blur-lg border-b border-gray-200/50" : "bg-transparent border-none"}`}>
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className={`text-xl font-bold text-gray-900 dark:text-white`}>{title}</h1>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <SimpleThemeToggle />
                    <div className="relative" ref={langDropdownRef}>
                        <button onClick={handleLanguageMenuToggle} className="p-2 hover:bg-gray-100 rounded-lg flex items-center space-x-1">
                            <span className="text-sm font-medium text-gray-700">{languages.find(l => l.code === language)?.flag}</span>
                        </button>

                        {showLangMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[140px] z-50">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setShowLangMenu(false);
                                        }}
                                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${language === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                                    >
                                        <span>{lang.flag}</span>
                                        <span className="text-sm">{lang.name}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    <div className="relative" ref={avatarDropdownRef}>
                        <button onClick={handleAvatarMenuToggle} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <img
                                src={import.meta.env.VITE_PUBLIC_URL + "directorApp/avatars/" + user?.avatar}
                                alt="Avatar"
                                className="w-8 h-8 object-cover rounded-full border-2 border-gray-200 cursor-pointer"
                                onError={e => {
                                    e.currentTarget.outerHTML = `<div class="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full border-2 border-gray-200 flex items-center justify-center text-white font-medium text-xs cursor-pointer">${user?.name.charAt(0)}</div>`;
                                }}
                            />
                        </button>

                        {showAvatarMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[160px] z-50">
                                {/* User Info */}
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <button onClick={handleProfileClick} className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-gray-700">
                                        <User size={16} className="text-gray-500" />
                                        <span className="text-sm">Profile</span>
                                    </button>

                                    <button onClick={handleLogoutClick} className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center space-x-3 text-red-600">
                                        <LogOut size={16} className="text-red-500" />
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
