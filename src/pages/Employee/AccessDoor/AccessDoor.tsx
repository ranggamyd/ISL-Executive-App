import API from "@/lib/api";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DoorOpen, Filter, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ListSkeleton } from "@/components/Common/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { AccessLogs as AccessLogsType } from "@/types/accessLogs";

const AccessDoor = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [accessLogs, setAccessLogs] = useState<AccessLogsType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchAccessLogs = async (page = 1, append = false, searchTerm = "") => {
        if (page === 1) setLoading(true);

        try {
            const { data } = await API.get("employees/accessDoors", {
                params: {
                    page,
                    searchTerm,
                },
            });

            const accesslogsList = data.access_doors.data;

            if (accesslogsList.length === 0) {
                setHasMore(false);
                if (searchTerm) setAccessLogs([]);
            } else {
                setAccessLogs(prev => (append ? [...prev, ...accesslogsList] : accesslogsList));
            }
        } catch (err: any) {
            swal("error", err.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccessLogs(page, page !== 1);
    }, [page]);

    useEffect(() => {
        setTimeout(() => {
            fetchAccessLogs(1, false, searchTerm);
        }, 250);
    }, [searchTerm]);

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t("search") + "..."} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Filter size={20} className="text-gray-600" />
                    </button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Access Logs</h3>

                <div className="space-y-4">
                    {loading ? (
                        <ListSkeleton items={searchTerm ? 1 : 3} />
                    ) : (
                        <InfiniteScroll
                            className="space-y-4 mb-3"
                            style={{ overflow: "hidden !important" }}
                            dataLength={accessLogs.length}
                            next={() => setPage(page + 1)}
                            hasMore={hasMore}
                            loader={<ListSkeleton items={3} />}
                            endMessage={
                                <div className="text-center py-4 text-gray-500">
                                    <p>No more logs to load</p>
                                </div>
                            }
                        >
                            {accessLogs.map((log, index) => (
                                <motion.div key={log.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.status === "Access diTerima" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                            <DoorOpen size={18} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{log.karyawan?.nama_lengkap}</p>
                                            <p className="text-sm text-gray-600">{log.device?.nama_device}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">{log.jam}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${log.status === "Access diTerima" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{log.status === "Access diTerima" ? "Granted" : "Denied"}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </InfiniteScroll>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AccessDoor;
