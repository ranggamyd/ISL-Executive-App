import API from "@/lib/api";
import swal from "@/utils/swal";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SalesIn as SalesInType } from "@/types/salesIn";
import { useLanguage } from "@/contexts/LanguageContext";
import { ListSkeleton } from "@/components/Common/Skeleton";
import { Filter, Search, ChevronDown, FileText, CheckCircle, CircleAlert } from "lucide-react";

const SalesIns: React.FC = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState<boolean>(true);
    const [salesIns, setSalesIns] = useState<SalesInType[]>([]);
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedAccountType, setSelectedAccountType] = useState<string>("");
    const [selectedPaymentType, setSelectedPaymentType] = useState<string>("");

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data } = await API.get("sales/salesIn", { params: { date } });

                setSalesIns(data.sales_in);
            } catch (err: any) {
                swal("error", err.response.data.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [date]);

    const uniqueStatus = [...new Set(salesIns.map(item => item.status))];
    const uniquePaymentType = [...new Set(salesIns.map(item => item.type_pembayaran))];
    const uniqueAccountType = [...new Set(salesIns.map(item => item.type_rekening))];

    const filteredSalesIns = salesIns.filter(item => {
        return (!selectedStatus || item.status === selectedStatus) && (!selectedPaymentType || item.type_pembayaran === selectedPaymentType) && (!selectedAccountType || item.type_rekening === selectedAccountType);
    });

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

    return (
        <div className="space-y-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-3 -mt-2">{t("salesIn")}</h2>
                <div className="flex items-center justify-center space-x-3">
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <div className="relative">
                        <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                            <Filter size={18} className="text-gray-600" />
                            <ChevronDown size={16} className={`text-gray-600 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
                        </button>

                        {filterOpen && (
                            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-64 z-10">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-gray-700">{t("sales")}</label>
                                        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="">{t("allSales")}</option>
                                            {uniqueStatus.map(status => (
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
                                            {uniquePaymentType.map(paymentType => (
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
                                            {uniqueAccountType.map(accountType => (
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
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <div className="flex justify-end items-end gap-2">
                <h6 className="font-medium uppercase">Total :</h6> <span className="bg-green-100 text-green-800 text-md font-medium px-3 py-0.5 rounded-lg">{formatCurrency(filteredSalesIns.reduce((acc, item) => acc + item.nominal, 0))}</span>
            </div>

            {loading ? (
                <ListSkeleton items={3} />
            ) : (
                <div className="grid gap-4">
                    {filteredSalesIns.map((item, index) => (
                        <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.5 }} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow transition-shadow">
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
                                    <span className="text-xs sm:text-sm truncate">{item.keterangan}</span>
                                </div>
                                <div className="flex flex-col items-end justify-between">
                                    <span className="text-lg font-bold text-gray-900">{formatCurrency(item.nominal)}</span>
                                    <div className="flex gap-2 mt-1">
                                        <span className="bg-purple-100 text-purple-800 text-xs rounded-full px-2 py-1">
                                            <span>{item.type_pembayaran}</span>
                                        </span>
                                        <span className="bg-yellow-100 text-yellow-800 text-xs rounded-full px-2 py-1">
                                            <span>{item.type_rekening}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredSalesIns.length === 0 && !loading && (
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
