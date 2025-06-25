import { ArrowLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LucideIconMap } from "@/utils/dynamicIcon";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu } from "@/types/menu";

const MenuDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const { t } = useLanguage();
    const { menus } = useAuth() as { menus: Menu[] };

    const navigate = useNavigate();
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        if (!search) return menus;
        return menus.filter(m => t(m.name).toLowerCase().includes(search.toLowerCase()));
    }, [menus, search, t]);

    const grouped = useMemo(() => {
        return filtered.reduce<Record<string, Menu[]>>((acc, curr) => {
            if (!acc[curr.group]) acc[curr.group] = [];
            acc[curr.group].push(curr);
            return acc;
        }, {});
    }, [filtered]);

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-[998]" onClick={onClose} />

                    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-0 z-[999] bg-white flex flex-col">
                        <div className="p-4 border-b border-gray-200 flex items-center justify-start">
                            <button onClick={onClose} className="me-3 text-gray-500 hover:text-black text-2xl">
                                <ArrowLeft size={24} />
                            </button>
                            <h3 className="text-lg font-semibold text-gray-700">{t("allMenus")}</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            <input type="text" placeholder={t("search") + "..."} value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            {Object.entries(grouped).map(([groupName, items]) => (
                                <div key={groupName}>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">{groupName}</h3>
                                    <div className="space-y-3">
                                        {items.map(menu => {
                                            const iconName = menu.icon as keyof typeof LucideIconMap;
                                            const Icon = LucideIconMap[iconName] as React.ElementType;
                                            const theme = menu.theme || "gray";

                                            return (
                                                <motion.button
                                                    key={menu.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        navigate(`/${menu.path}`);
                                                        onClose();
                                                    }}
                                                    className={`
                                                        w-full flex items-center gap-3 p-3 rounded-xl
                                                        border shadow-sm transition-all
                                                        border-${theme}-100 hover:shadow-md
                                                    `}
                                                >
                                                    {Icon && (
                                                        <div
                                                            className={`
                                                                w-10 h-10 flex items-center justify-center rounded-full
                                                                bg-gradient-to-br from-${theme}-50 to-${theme}-100
                                                                border border-${theme}-200
                                                            `}
                                                        >
                                                            <Icon className={`text-${theme}-700`} size={20} />
                                                        </div>
                                                    )}
                                                    <span className={`text-sm font-medium text-${theme}-800 truncate`}>{t(menu.name)}</span>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MenuDrawer;
