import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
    title: string;
    showBack?: boolean;
    onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { t } = useLanguage();

    const { user, logout } = useAuth();

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
        }).then((result) => {
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

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? "bg-white/50 shadow-md backdrop-blur-lg" : "bg-transparent border-none"}`}>
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className={`text-xl font-bold transition-colors duration-300 ${isScrolled ? "text-gray-900" : "text-white drop-shadow-md"}`}>{title}</h1>
                    </div>
                </div>

                <div className="flex items-center space-x-1">
                    <div className="relative" ref={avatarDropdownRef}>
                        <button onClick={handleAvatarMenuToggle} className={`p-1 rounded-full transition-colors duration-300 ${isScrolled ? "hover:bg-gray-100" : "hover:bg-white/20 backdrop-blur-sm"}`}>
                            <img
                                src={import.meta.env.VITE_PUBLIC_URL + "directorApp/avatars/" + user?.avatar}
                                alt="Avatar"
                                className={`w-8 h-8 object-cover rounded-full border-2 transition-colors duration-300 ${isScrolled ? "border-gray-200" : "border-white/50"} cursor-pointer`}
                                onError={(e) => {
                                    e.currentTarget.outerHTML = `<div class="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full border-2 ${isScrolled ? "border-gray-200" : "border-white/50"} flex items-center justify-center text-white font-medium text-xs cursor-pointer">${user?.name.charAt(0)}</div>`;
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
