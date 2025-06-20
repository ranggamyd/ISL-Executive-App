import { Globe } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
    const { user } = useAuth();

    const { language, setLanguage } = useLanguage();

    const [showLangMenu, setShowLangMenu] = useState(false);

    return (
        <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2 hover:bg-gray-100 rounded-lg flex items-center space-x-1">
                            <Globe size={18} className="text-gray-700" />
                            <span className="text-sm font-medium text-gray-700">{languages.find(l => l.code === language)?.flag}</span>
                        </button>

                        {showLangMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[140px]">
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

                    {/* <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                        <Bell size={18} className="text-gray-700" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                    </button> */}

                    <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} alt={user?.name} className="w-8 h-8 rounded-full border-2 border-gray-200" />
                </div>
            </div>
        </header>
    );
};

export default Header;
