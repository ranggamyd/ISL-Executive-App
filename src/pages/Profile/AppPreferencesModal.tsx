import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { Globe, MonitorCog, Moon, Palette, Settings, Sun } from "lucide-react";
import { useLanguage, type Language as LanguageType } from "@/contexts/LanguageContext";

const languages = [
    { code: "en" as LanguageType, name: "English", flag: "🇺🇸" },
    { code: "id" as LanguageType, name: "Indonesian", flag: "🇮🇩" },
    { code: "zh" as LanguageType, name: "Chinese", flag: "🇨🇳" },
];

const themes = [
    { key: "light", icon: Sun, label: "Light" },
    { key: "dark", icon: Moon, label: "Dark" },
    { key: "system", icon: MonitorCog, label: "System" },
];

const AppPreferencesModal = ({ setIsAppPreferencesOpen }: { setIsAppPreferencesOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ marginTop: 0, zIndex: 51 }} onClick={() => setIsAppPreferencesOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Settings size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("appPreferences")}</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <Globe size={18} className="text-gray-600 dark:text-gray-400" />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("language")}</label>
                        </div>
                        <div className="space-y-2">
                            {languages.map((lang) => (
                                <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${language === lang.code ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                                    <div className="flex items-center space-x-3">
                                        <span className="text-lg">{lang.flag}</span>
                                        <span className="text-sm font-medium">{t(lang.name.toLowerCase())}</span>
                                    </div>
                                    {language === lang.code && (
                                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <Palette size={18} className="text-gray-600 dark:text-gray-400" />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("theme")}</label>
                        </div>
                        <div className="space-y-2">
                            {themes.map((themeOption) => {
                                const Icon = themeOption.icon;
                                return (
                                    <button key={themeOption.key} onClick={() => setTheme(themeOption.key as any)} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${theme === themeOption.key ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                                        <div className="flex items-center space-x-3">
                                            <Icon size={18} />
                                            <span className="text-sm font-medium">{t(themeOption.label.toLowerCase())}</span>
                                        </div>
                                        {theme === themeOption.key && (
                                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button onClick={() => setIsAppPreferencesOpen(false)} className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                        {t("close")}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AppPreferencesModal;
