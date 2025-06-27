import React, { MutableRefObject, ReactNode, useEffect } from "react";
import FilterButton from "./FilterButton";
import SearchInput from "./SearchInput";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchInputWithFilterProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    filterOpen: boolean;
    setFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
    clearFilters: () => void;
    filterRef: MutableRefObject<HTMLDivElement | null>;
    children?: ReactNode;
}

const SearchInputWithFilter: React.FC<SearchInputWithFilterProps> = ({ searchTerm, setSearchTerm, filterRef, filterOpen, setFilterOpen, clearFilters, children }) => {
    const { t } = useLanguage();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="flex items-center space-x-4">
            <div className="flex-1">
                <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>
            <div className="relative" ref={filterRef}>
                <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />
                {filterOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                        <div className="p-4 space-y-4">
                            {children}

                            <div className="flex justify-end">
                                <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:underline me-1">
                                    {t("clearAll")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SearchInputWithFilter;
