import { useLanguage } from "@/contexts/LanguageContext";
import { Menu as MenuType } from "@/types/menu";
import { LucideIconMap } from "@/utils/dynamicIcon";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MenuItemCard = ({ index, menu, setIsDrawerOpen }: { index: number; menu: MenuType; setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const iconName = menu.icon as keyof typeof LucideIconMap;
    const Icon = LucideIconMap[iconName] as React.ElementType;

    return (
        <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            className="group flex flex-col items-center justify-center gap-2 p-3 rounded-2xl shadow-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 hover:from-blue-50 hover:to-white dark:hover:from-blue-900/20 dark:hover:to-gray-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300"
            onClick={() => {
                if (menu.id === "allMenus") {
                    setIsDrawerOpen(true);
                } else {
                    navigate(`/${menu.path}`);
                }
            }}
        >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 via-white to-purple-100 dark:from-blue-900/50 dark:via-gray-700 dark:to-purple-900/50 border border-blue-200 dark:border-blue-700 shadow-sm group-hover:shadow-md transition-all duration-300">
                <Icon size={18} className="text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300" />
            </div>
            <p className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-all duration-300 truncate w-full">{t(menu.name)}</p>
        </motion.button>
    );
};

export default MenuItemCard;
