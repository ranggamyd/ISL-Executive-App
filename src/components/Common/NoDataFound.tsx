import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NoDataFound = () => {
    const { t } = useLanguage();

    return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>{t("noDataFound")}</p>
        </div>
    );
};

export default NoDataFound;
