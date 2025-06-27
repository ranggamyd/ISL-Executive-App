import API from "@/lib/api";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import { EmployeeDetail } from "./EmployeeDetail";
import { useEffect, useRef, useState } from "react";
import Lightbox from "@/components/Common/Lightbox";
import { useLanguage } from "@/contexts/LanguageContext";
import NoDataFound from "@/components/Common/NoDataFound";
import { Employee as EmployeeType } from "@/types/employee";
import { ListSkeleton } from "@/components/Common/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchInputWithFilter from "@/components/Common/SearchInputWithFilter";

const Employees = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);
    const filterRef = useRef<HTMLDivElement | null>(null);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [uniqueStatuses, setUniqueStatuses] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [uniquePositions, setUniquePositions] = useState<{ id: string; nama_jabatan: string }[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<string>("");
    const [uniqueDepartments, setUniqueDepartments] = useState<{ id: string; nama_divisi: string }[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState("");

    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const fetchEmployees = async (page = 1, append = false, searchTerm = "") => {
        if (page === 1) setLoading(true);

        try {
            const { data } = await API.get("employees/employees", {
                params: {
                    page,
                    searchTerm,
                    status: selectedStatus,
                    position: selectedPosition,
                    department: selectedDepartment,
                },
            });

            const employeesList = data.data.data;

            if (employeesList.length === 0) {
                if (page === 1) setEmployees([]);
                setHasMore(false);
            } else {
                setEmployees(prev => (append ? [...prev, ...employeesList] : employeesList));
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
        fetchEmployees(1, false, debouncedSearch);
    }, [debouncedSearch, selectedPosition, selectedStatus, selectedDepartment]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchEmployees(nextPage, true, debouncedSearch);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data } = await API.get("employees/employeeFilter");

                const employeeFilter = data.data;

                setUniqueStatuses(employeeFilter.statuses);
                setUniquePositions(employeeFilter.positions);
                setUniqueDepartments(employeeFilter.departments);
            } catch (err: any) {
                swal("error", err.response.data.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const clearFilters = (): void => {
        setSelectedStatus("");
        setSelectedPosition("");
        setSelectedDepartment("");
    };

    if (showDetail && selectedEmployee) {
        return <EmployeeDetail employee={selectedEmployee} onClose={() => setShowDetail(false)} />;
    }

    const handleEmployeeAction = (employee: EmployeeType, action: "view" | "approve" | "reject") => {
        if (action === "view") {
            setSelectedEmployee(employee);
            setShowDetail(true);
        }
    };

    const openLightbox = (image: string, title: string) => {
        setLightboxImage(image);
        setLightboxTitle(title);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setLightboxImage("");
        setLightboxTitle("");
    };

    const getStatusColor = (status_karyawan: EmployeeType["status_karyawan"]) => {
        let className = "";
        if (status_karyawan == "Permanent") {
            className = "bg-blue-100 dark:bg-blue-500/50 border border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200";
        } else if (status_karyawan == "Special") {
            className = "bg-yellow-100 dark:bg-yellow-500/50 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200";
        } else if (status_karyawan == "Probation") {
            className = "bg-red-100 dark:bg-red-500/50 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200";
        } else if (status_karyawan == "Freelance") {
            className = "bg-green-100 dark:bg-green-500/50 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200";
        } else if (status_karyawan == "Training") {
            className = "bg-red-100 dark:bg-red-500/50 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200";
        } else if (status_karyawan == "Contract") {
            className = "bg-green-100 dark:bg-green-500/50 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200";
        } else if (status_karyawan == "Kontrak") {
            className = "bg-green-100 dark:bg-green-500/50 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200";
        } else if (status_karyawan == "Magang/Intern") {
            className = "bg-yellow-100 dark:bg-yellow-500/50 border border-yellow-200 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200";
        } else {
            className = "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
        }

        return className;
    };

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">{t("employeeList")}</h2>
            </motion.div>

            <SearchInputWithFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} clearFilters={clearFilters}>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("employeeStatus")}</label>
                    <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">{t("allStatuses")}</option>
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("department")}</label>
                    <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">{t("allDepartments")}</option>
                        {uniqueDepartments.map(department => (
                            <option key={department.id} value={department.id}>
                                {department.nama_divisi}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("position")}</label>
                    <select value={selectedPosition} onChange={e => setSelectedPosition(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">{t("allPositions")}</option>
                        {uniquePositions.map(position => (
                            <option key={position.id} value={position.id}>
                                {position.nama_jabatan}
                            </option>
                        ))}
                    </select>
                </div>
            </SearchInputWithFilter>

            {loading ? (
                <ListSkeleton items={searchTerm ? 1 : 3} />
            ) : employees.length < 1 ? (
                <NoDataFound />
            ) : (
                <InfiniteScroll className="space-y-3 mb-3" style={{ overflow: "hidden !important" }} dataLength={employees.length} next={loadMore} hasMore={hasMore} loader={<ListSkeleton items={3} />}>
                    {employees.map((employee, index) => (
                        <motion.div key={employee.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div onClick={() => handleEmployeeAction(employee, "view")} className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    <img
                                        src={import.meta.env.VITE_PUBLIC_URL + "Foto_Karyawan/" + employee.image}
                                        alt="Employee Avatar"
                                        className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                        onClick={() => openLightbox(import.meta.env.VITE_PUBLIC_URL + "Foto_Karyawan/" + employee.image, employee.nama_lengkap)}
                                        onError={e => {
                                            e.currentTarget.outerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold cursor-default">${employee.nama_lengkap.charAt(0)}</div>`;
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{employee.nama_lengkap}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{employee.jabatan.nama_jabatan}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{employee.department}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(employee.status_karyawan)}`}>{t(employee.status_karyawan)}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm px-2">
                                <div className="flex items-center sm:justify-start space-x-2">
                                    <Mail size={13} className="text-gray-400 dark:text-gray-500" />
                                    <small className="text-xs text-gray-600 dark:text-gray-400">{employee.email}</small>
                                </div>
                                <div className="flex items-center sm:justify-center space-x-2">
                                    <Phone size={13} className="text-gray-400 dark:text-gray-500" />
                                    <small className="text-xs text-gray-600 dark:text-gray-400">{employee.no_telpon}</small>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </InfiniteScroll>
            )}

            {lightboxOpen && <Lightbox image={lightboxImage} title={lightboxTitle} onClose={closeLightbox} />}
        </div>
    );
};

export default Employees;
