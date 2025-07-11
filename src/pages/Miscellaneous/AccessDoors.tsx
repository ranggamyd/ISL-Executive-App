import API from "@/lib/api";
import Swal from "sweetalert2";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ListSkeleton } from "@/components/Common/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { AccessLogs as AccessLogsType } from "@/types/accessLogs";
import { ChevronDown, DoorClosed, DoorClosedLocked, DoorOpen, Filter, LaptopMinimalCheck, Search } from "lucide-react";
import SearchInput from "@/components/Common/SearchInput";
import FilterButton from "@/components/Common/FilterButton";
import SearchInputWithFilter from "@/components/Common/SearchInputWithFilter";
import NoDataFound from "@/components/Common/NoDataFound";

const AccessDoors = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [accessLogs, setAccessLogs] = useState<AccessLogsType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const filterRef = useRef<HTMLDivElement | null>(null);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [uniqueDevices, setUniqueDevices] = useState<{ id: string; nama_device: string }[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>("");
    const [uniqueEmployees, setUniqueEmployees] = useState<{ id: string; nama_lengkap: string }[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<string>("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const debouncedSearch = useDebounce(searchTerm, 1000);

    const fetchAccessLogs = async (page = 1, append = false, searchTerm = "") => {
        if (page === 1) setLoading(true);

        try {
            const { data } = await API.get("employees/accessDoors", {
                params: {
                    page,
                    searchTerm,
                    device: selectedDevice,
                    employee: selectedEmployee,
                },
            });

            const accesslogsList = data.data.data;

            if (accesslogsList.length === 0) {
                if (page === 1) setAccessLogs([]);
                setHasMore(false);
            } else {
                setAccessLogs(prev => (append ? [...prev, ...accesslogsList] : accesslogsList));
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
        fetchAccessLogs(1, false, debouncedSearch);
    }, [debouncedSearch, selectedDevice, selectedEmployee]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchAccessLogs(nextPage, true, debouncedSearch);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data } = await API.get("employees/accesslogFilter");

                const accesslogFilter = data.data;

                setUniqueDevices(accesslogFilter.devices);
                setUniqueEmployees(accesslogFilter.employees);
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
        setSelectedDevice("");
        setSelectedEmployee("");
    };

    const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";

    const handleDoorAction = (mode: string) => {
        Swal.fire({
            theme: theme,
            title: t(`confirm_${mode}AllDoors`),
            confirmButtonText: t(mode),
            cancelButtonText: t("cancel"),
            confirmButtonColor: mode === "normalize" ? "#ea580c" : "#16a34a",
            showCancelButton: true,
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "info",
                    title: t("comingSoon"),
                    text: t("featureIsCurrentlyBeingDeveloped"),
                });
            }
        });
    };

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">{t("accessLogList")}</h2>
            </motion.div>

            <SearchInputWithFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} clearFilters={clearFilters}>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("device")}</label>
                    <select value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">{t("allDevices")}</option>
                        {uniqueDevices.map(device => (
                            <option key={device.id} value={device.id}>
                                {device.nama_device}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("employee")}</label>
                    <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">{t("allEmployees")}</option>
                        {uniqueEmployees.map(employee => (
                            <option key={employee.id} value={employee.id}>
                                {employee.nama_lengkap}
                            </option>
                        ))}
                    </select>
                </div>
            </SearchInputWithFilter>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex space-x-2 mt-3">
                <button onClick={() => handleDoorAction("open")} className="flex-1 bg-gradient-to-br from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <DoorOpen size={18} />
                    <span className="text-xs">{t("openAllDoors")}</span>
                </button>
                <button onClick={() => handleDoorAction("normalize")} className="flex-1 bg-gradient-to-br from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <LaptopMinimalCheck size={18} />
                    <span className="text-xs">{t("normalizeDoors")}</span>
                </button>
            </motion.div>

            {loading ? (
                <ListSkeleton items={searchTerm ? 1 : 3} />
            ) : accessLogs.length < 1 ? (
                <NoDataFound />
            ) : (
                <InfiniteScroll className="space-y-3 mb-3" style={{ overflow: "hidden !important" }} dataLength={accessLogs.length} next={loadMore} hasMore={hasMore} loader={<ListSkeleton items={3} />}>
                    {accessLogs.map((log, index) => (
                        <motion.div key={log.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.status === "Access diTerima" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}>{log.status === "Access diTerima" ? <DoorOpen size={18} /> : <DoorClosedLocked size={18} />}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-white truncate">{log.karyawan?.nama_lengkap}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{log.device?.nama_device}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`-me-2 text-xs px-2 py-1 rounded-full ${log.status === "Access diTerima" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{log.status === "Access diTerima" ? t("granted") : t("denied")}</span>
                                <p className="text-xs mt-1 font-medium text-gray-900 dark:text-gray-400">{log.jam}</p>
                            </div>
                        </motion.div>
                    ))}
                </InfiniteScroll>
            )}
        </div>
    );
};

export default AccessDoors;
