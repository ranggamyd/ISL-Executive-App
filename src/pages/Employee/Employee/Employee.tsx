import API from "@/lib/api";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Employee as EmployeeType } from "@/types/employee";
import { ListSkeleton } from "@/components/Common/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { Calendar, ChevronDown, Filter, Mail, Phone, Search, X } from "lucide-react";

const Employee = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<EmployeeType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const debouncedSearch = useDebounce(searchTerm, 1000);

    const navigate = useNavigate();

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState("");

    const fetchEmployees = async (page = 1, append = false, searchTerm = "") => {
        if (page === 1) setLoading(true);

        try {
            const { data } = await API.get("employees", {
                params: {
                    page,
                    searchTerm,
                },
            });

            const employeesList = data.employees.data;

            if (employeesList.length === 0) {
                setHasMore(false);
                if (searchTerm) setEmployees([]);
            } else {
                setEmployees(prev => (append ? [...prev, ...employeesList] : employeesList));
            }
        } catch (err: any) {
            swal("error", err.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees(page, page !== 1, debouncedSearch);
    }, [page, debouncedSearch]);

    const getStatusColor = (status_karyawan: EmployeeType["status_karyawan"]) => {
        let className = "";
        if (status_karyawan == "Permanent") {
            className = "bg-blue-100 text-blue-800";
        } else if (status_karyawan == "Special") {
            className = "bg-yellow-100 text-yellow-800";
        } else if (status_karyawan == "Probation") {
            className = "bg-red-100 text-red-800";
        } else if (status_karyawan == "Freelance") {
            className = "bg-green-100 text-green-800";
        } else if (status_karyawan == "Training") {
            className = "bg-red-100 text-red-800";
        } else if (status_karyawan == "Contract") {
            className = "bg-green-100 text-green-800";
        } else if (status_karyawan == "Kontrak") {
            className = "bg-green-100 text-green-800";
        } else if (status_karyawan == "Magang/Intern") {
            className = "bg-yellow-100 text-yellow-800";
        } else {
            className = "bg-gray-100 text-gray-800";
        }

        return className;
    };

    const openLightbox = (imageSrc: string, title: string) => {
        setLightboxImage(imageSrc);
        setLightboxTitle(title);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setLightboxImage("");
        setLightboxTitle("");
    };

    return (
        <div className="space-y-4">
            {lightboxOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeLightbox}>
                    <div className="relative max-w-4xl max-h-[90vh] p-4">
                        <button onClick={closeLightbox} className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold">
                            <X size={32} />
                        </button>
                        <img src={lightboxImage} alt={lightboxTitle} className="max-w-full max-h-full object-contain rounded-lg" onClick={e => e.stopPropagation()} />
                        {lightboxTitle && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                                <h3 className="text-lg font-semibold">{lightboxTitle}</h3>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-800 text-center mb-3 -mt-2">{t("employeeList")}</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder={t("search") + "..."} className="w-full pl-12 pe-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div className="relative">
                        <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                            <Filter size={18} className="text-gray-600" />
                            <ChevronDown size={16} className={`text-gray-600`} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <ListSkeleton items={searchTerm ? 1 : 3} />
            ) : (
                <InfiniteScroll className="space-y-4 mb-3" style={{ overflow: "hidden !important" }} dataLength={employees.length} next={() => setPage(page + 1)} hasMore={hasMore} loader={<ListSkeleton items={3} />}>
                    {employees.map((employee, index) => (
                        <motion.div key={employee.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={import.meta.env.VITE_PUBLIC_URL + "Foto_Karyawan/" + employee.image}
                                        alt="Candidate Avatar"
                                        className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                        onClick={() => openLightbox(import.meta.env.VITE_PUBLIC_URL + "Foto_Karyawan/" + employee.image, employee.nama_lengkap)}
                                        onError={e => {
                                            e.currentTarget.outerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold cursor-default">${employee.nama_lengkap.charAt(0)}</div>`;
                                        }}
                                    />
                                    <div>
                                        <h3
                                            onClick={() =>
                                                navigate(`/employee/employeeDetail`, {
                                                    state: { employee },
                                                })
                                            }
                                            className="font-semibold text-gray-900"
                                        >
                                            {employee.nama_lengkap}
                                        </h3>
                                        <p className="text-sm text-gray-600">{employee.jabatan.nama_jabatan}</p>
                                        <p className="text-xs text-gray-500">{employee.department}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(employee.status_karyawan)}`}>{t(employee.status_karyawan)}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Mail size={13} className="text-gray-400" />
                                    <small className="text-xs text-gray-600">{employee.email}</small>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone size={13} className="text-gray-400" />
                                    <small className="text-xs text-gray-600">{employee.no_telpon}</small>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar size={13} className="text-gray-400" />
                                    <small className="text-xs text-gray-600">{t('joined')}: {new Date(employee.tgl_mulai_kerja).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</small>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </InfiniteScroll>
            )}

            {employees.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>{t("noDataFound")}</p>
                </div>
            )}
        </div>
    );
};

export default Employee;
