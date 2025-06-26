import API from "@/lib/api";
import swal from "@/utils/swal";
import useDebounce from "@/hooks/useDebounce";
import { AnimatePresence, motion } from "framer-motion";
import { SalesIn as SalesInType } from "@/types/salesIn";
import { useLanguage } from "@/contexts/LanguageContext";
import React, { useState, useEffect, useRef } from "react";
import { ListSkeleton } from "@/components/Common/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { Filter, Search, ChevronDown, FileText, CheckCircle, CircleAlert } from "lucide-react";

const SalesIns: React.FC = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState<boolean>(true);
    const [salesIns, setSalesIns] = useState<SalesInType[]>([]);
    const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const filterRef = useRef<HTMLDivElement | null>(null);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [uniqueAccountTypes, setUniqueAccountTypes] = useState<string[]>([]);
    const [selectedAccountType, setSelectedAccountType] = useState<string>("");
    const [uniquePaymentTypes, setUniquePaymentTypes] = useState<string[]>([]);
    const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [salesInTotal, setSalesInTotal] = useState(0);

    const debouncedSearch = useDebounce(searchTerm, 1000);

    const fetchSalesIns = async (page = 1, append = false, searchTerm = "") => {
        if (page === 1) setLoading(true);

        try {
            const { data } = await API.get("sales/salesIn", {
                params: { date, status: selectedStatus, accountType: selectedAccountType, paymentType: selectedPaymentType, page, searchTerm },
            });

            setSalesInTotal(data.salesInCount);
            const salesInsList = data.data.data;

            if (salesInsList.length === 0) {
                if (page === 1) setSalesIns([]);
                setHasMore(false);
            } else {
                setSalesIns(prev => (append ? [...prev, ...salesInsList] : salesInsList));
                setHasMore(data.data.next_page_url !== null);
            }
        } catch (err: any) {
            swal("error", err.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchSalesIns(1, false, debouncedSearch);
    }, [debouncedSearch, date, selectedStatus, selectedAccountType, selectedPaymentType]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchSalesIns(nextPage, true, debouncedSearch);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data } = await API.get("sales/salesInFilter");

                const salesInFilter = data.data;

                setUniqueStatuses(salesInFilter.statuses);
                setUniqueAccountTypes(salesInFilter.accountTypes);
                setUniquePaymentTypes(salesInFilter.paymentTypes);
            } catch (err: any) {
                swal("error", err.response.data.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

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

    const clearFilters = (): void => {
        setSelectedStatus("");
        setSelectedPaymentType("");
        setSelectedAccountType("");
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const toggleItem = (index: number) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-3 -mt-2">{t("salesIn")}</h2>
                <div className="flex items-center justify-center space-x-3">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="relative" ref={filterRef}>
                        <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                            <Filter size={18} className="text-gray-600" />
                            <ChevronDown size={16} className={`text-gray-600 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
                        </button>

                        {filterOpen && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="p-4 space-y-4">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">{t("sales")}</label>
                                        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allStatuses")}</option>
                                            {uniqueStatuses.map(status => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">{t("paymentType")}</label>
                                        <select value={selectedPaymentType} onChange={e => setSelectedPaymentType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allPaymentTypes")}</option>
                                            {uniquePaymentTypes.map(paymentType => (
                                                <option key={paymentType} value={paymentType}>
                                                    {paymentType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">{t("accountType")}</label>
                                        <select value={selectedAccountType} onChange={e => setSelectedAccountType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allAccountTypes")}</option>
                                            {uniqueAccountTypes.map(accountType => (
                                                <option key={accountType} value={accountType}>
                                                    {accountType}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex justify-end">
                                        <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800 hover:underline me-1">
                                            {t("clearAll")}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t("search") + "..."} className="w-full pl-12 pe-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
            </motion.div>

            <div className="flex justify-end items-end gap-2">
                <h6 className="font-medium uppercase">Total :</h6> <span className="bg-green-100 text-green-800 text-md font-medium px-3 py-0.5 rounded-lg">{formatCurrency(salesInTotal)}</span>
            </div>

            {loading ? (
                <ListSkeleton items={3} />
            ) : (
                <div className="grid gap-4">
                    <InfiniteScroll className="space-y-3 mb-3" style={{ overflow: "hidden !important" }} dataLength={salesIns.length} next={loadMore} hasMore={hasMore} loader={<ListSkeleton items={3} />}>
                        {salesIns.map((item, index) => (
                            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
                                <div className="grid grid-cols-2 gap-4 items-start">
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            <span className="font-medium">{item.no_dokumen}</span>
                                        </div>
                                        {item.status == "Done" ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-green-800">{item.status}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <CircleAlert className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-800">{item.status}</span>
                                            </div>
                                        )}
                                        <div onClick={() => toggleItem(index)} className="cursor-pointer">
                                            <AnimatePresence initial={false}>
                                                <motion.div
                                                    key={`collapse-${index}`}
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{
                                                        height: "auto",
                                                        opacity: 1,
                                                    }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.15, ease: "easeInOut" }}
                                                    className={`overflow-hidden text-xs sm:text-sm ${openItems[index] ? "" : "whitespace-nowrap truncate"}`}
                                                >
                                                    {item.keterangan}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end justify-between">
                                        <span className="text-lg font-bold text-gray-900">{formatCurrency(item.nominal)}</span>
                                        <div className="flex gap-2 mt-1">
                                            <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-2 py-1">{item.type_pembayaran}</span>
                                            <span className="bg-yellow-100 text-yellow-800 text-xs rounded-full px-2 py-1">{item.type_rekening}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </InfiniteScroll>

                    {salesIns.length === 0 && !loading && (
                        <div className="text-center py-10 text-gray-500">
                            <Search size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">{t("noDataFound")}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SalesIns;
