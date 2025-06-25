import API from "@/lib/api";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState, useEffect, useRef } from "react";
import { CardSkeleton, StatSkeleton } from "@/components/Common/Skeleton";
import { BarChart3, Filter, ChevronDown, UserPlus, Users, FileText, Coins, Wallet, DoorOpen, MapPin, DollarSign, FileBarChart2, ShoppingCart, Search } from "lucide-react";
import { LucideIconMap } from "@/utils/dynamicIcon";
import MenuDrawer from "@/components/Layout/MenuDrawer";

const HomePage: React.FC = () => {
    const { t } = useLanguage();

    const { user, menus, permissions } = useAuth();

    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState<boolean>(false);

    const [limit, setLimit] = useState(6);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const update = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setLimit(12);
            } else if (width >= 640) {
                setLimit(8);
            } else {
                setLimit(6);
            }
        };

        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const showAllButton = {
        id: "allMenus",
        name: "allMenus",
        group: null,
        path: null,
        icon: "LayoutGrid",
        theme: "gray",
    };

    const limitedMenus = [...(menus ?? []).slice(0, limit - 1), showAllButton];

    return (
        <>
            <div className="p-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t("search") + "..."} className="w-full pl-12 pe-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                {loading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <CardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {limitedMenus.map(menu => {
                            const iconName = menu.icon as keyof typeof LucideIconMap;
                            const Icon = LucideIconMap[iconName] as React.ElementType;
                            const theme = menu.theme || "gray";

                            return (
                                <motion.button
                                    key={menu.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                    group flex flex-col items-center justify-center gap-2
                                    p-4 rounded-2xl shadow border transition-all duration-300
                                    border-${theme}-100 hover:shadow-md hover:from-${theme}-100 hover:to-white
                                `}
                                    onClick={() => {
                                        if (menu.id === "allMenus") {
                                            setIsDrawerOpen(true);
                                        } else {
                                            navigate(`/${menu.path}`);
                                        }
                                    }}
                                >
                                    {Icon && (
                                        <div
                                            className={`
                                                flex items-center justify-center w-12 h-12 rounded-full
                                                bg-gradient-to-br from-${theme}-50 to-${theme}-100 border border-${theme}-300
                                                group-hover:scale-110 transition-transform duration-300
                                            `}
                                        >
                                            <Icon size={22} className={`text-${theme}-700`} />
                                        </div>
                                    )}

                                    <p className={`text-sm font-semibold text-${theme}-800 text-center truncate`}>{t(menu.name)}</p>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>

            <MenuDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </>
    );
};

export default HomePage;
