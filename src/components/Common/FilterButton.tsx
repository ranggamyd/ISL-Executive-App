import { ChevronDown, Filter } from "lucide-react";

const FilterButton = ({ filterOpen, setFilterOpen }: { filterOpen: boolean; setFilterOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center space-x-2 px-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white">
            <Filter size={18} className="text-gray-500" />
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
        </button>
    );
};

export default FilterButton;
