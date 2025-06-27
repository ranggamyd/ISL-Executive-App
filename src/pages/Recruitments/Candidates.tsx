import API from "@/lib/api";
import Swal from "sweetalert2";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ListSkeleton } from "@/components/Common/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { Candidate as CandidateType } from "@/types/candidate";
import { CheckCircle, ChevronDown, Eye, Filter, Search, X, XCircle } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserAccess";
import { CandidateDetail } from "./CandidateDetail";
import SearchInput from "@/components/Common/SearchInput";
import FilterButton from "@/components/Common/FilterButton";

const Candidates = () => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState<CandidateType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const filterRef = useRef<HTMLDivElement>(null);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [uniquePositions, setUniquePositions] = useState<{ id: string; nama_jabatan: string }[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<string>("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const debouncedSearch = useDebounce(searchTerm, 1000);

    const navigate = useNavigate();

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState("");

    const [selectedCandidate, setSelectedCandidate] = useState<CandidateType | null>(null);
    const [showDetail, setShowDetail] = useState(false);

    const { canAccess } = useUserAccess();

    const fetchCandidates = async (page = 1, append = false, searchTerm = "") => {
        if (page === 1) setLoading(true);

        try {
            const { data } = await API.get("recruitment/candidates", {
                params: { page, searchTerm, position: selectedPosition },
            });

            const candidatesList = data.data.data;

            if (candidatesList.length === 0) {
                if (page === 1) setCandidates([]);
                setHasMore(false);
            } else {
                setCandidates((prev) => (append ? [...prev, ...candidatesList] : candidatesList));
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
        fetchCandidates(1, false, debouncedSearch);
    }, [debouncedSearch, selectedPosition]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchCandidates(nextPage, true, debouncedSearch);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);

            try {
                const { data } = await API.get("recruitment/candidateFilter");

                const candidateFilter = data.data;

                setUniquePositions(candidateFilter.positions);
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
        setSelectedPosition("");
    };

    const calculateYOE = (months_of_experience: number) => {
        const months = months_of_experience;
        const years = Math.floor(months / 12);

        const remainingMonths = months % 12;

        return `${years},${remainingMonths} years`;
    };

    const handleCandidateAction = (candidate: CandidateType, action: "view" | "approve" | "reject") => {
        if (action === "view") {
            // const yoe = calculateYOE(candidate.months_of_experience);
            setSelectedCandidate(candidate);
            setShowDetail(true);
        } else {
            Swal.fire({
                title: t(`confirm_${action}Candidate`),
                confirmButtonText: t(action),
                cancelButtonText: t("cancel"),
                confirmButtonColor: action === "approve" ? "#22C55E" : "#EF4444",
                showCancelButton: true,
                reverseButtons: true,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setLoading(true);
                    try {
                        const { data } = await API.post(`recruitment/${action}Candidate`, {
                            id: candidate.id,
                        });

                        swal("success", data.message);
                    } catch (err: any) {
                        swal("error", err.response.data.message);
                    } finally {
                        setLoading(false);
                    }
                }
            });
        }
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

    if (showDetail && selectedCandidate) {
        return <CandidateDetail candidate={selectedCandidate} yoe={calculateYOE(selectedCandidate.months_of_experience)} onClose={() => setShowDetail(false)} />;
    }

    return (
        <div className="p-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div className="space-y-4">
                    {lightboxOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center" style={{ zIndex: 51 }} onClick={closeLightbox}>
                            <div className="relative max-w-4xl max-h-[90vh] p-4">
                                <button onClick={closeLightbox} className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold">
                                    <X size={32} />
                                </button>
                                <img src={lightboxImage} alt={lightboxTitle} className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                                {lightboxTitle && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                                        <h3 className="text-lg font-semibold">{lightboxTitle}</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl p-3.5 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-3 -mt-2">{t("candidateList")}</h2>
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            </div>
                            <div className="relative" ref={filterRef}>
                                <FilterButton filterOpen={filterOpen} setFilterOpen={setFilterOpen} />

                                {filterOpen && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800/95 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                                        <div className="p-4 space-y-4">
                                            <div className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-white">{t("position")}</label>
                                                <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="w-full px-3 py-2 dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                    <option value="">{t("allPositions")}</option>
                                                    {uniquePositions.map((position) => (
                                                        <option key={position.id} value={position.id}>
                                                            {position.nama_jabatan}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
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
                    </motion.div>

                    {loading ? (
                        <ListSkeleton items={searchTerm ? 1 : 3} />
                    ) : (
                        <InfiniteScroll className="space-y-3 mb-3" style={{ overflow: "hidden !important" }} dataLength={candidates.length} next={loadMore} hasMore={hasMore} loader={<ListSkeleton items={3} />}>
                            {candidates.map((candidate, index) => (
                                <motion.div key={candidate.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={import.meta.env.VITE_PUBLIC_URL + "recruitment/foto/" + candidate.foto_selfie}
                                                alt="Avatar"
                                                className="w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                                onClick={() => openLightbox(import.meta.env.VITE_PUBLIC_URL + "recruitment/foto/" + candidate.foto_selfie, candidate.nama_lengkap)}
                                                onError={(e) => {
                                                    e.currentTarget.outerHTML = `<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold cursor-default">${candidate.nama_lengkap.charAt(0)}</div>`;
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 onClick={() => handleCandidateAction(candidate, "view")} className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {candidate.nama_lengkap}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{candidate.jabatan.nama_jabatan}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-3">
                                        <button onClick={() => handleCandidateAction(candidate, "view")} className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                                            <Eye size={18} />
                                            <span className="text-xs hidden sm:block">{t("resume")}</span>
                                        </button>
                                        {canAccess("candidates", "reject") && (
                                            <button onClick={() => handleCandidateAction(candidate, "reject")} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                                                <XCircle size={18} />
                                                <span className="text-xs">{t("reject")}</span>
                                            </button>
                                        )}
                                        {canAccess("candidates", "approve") && (
                                            <button onClick={() => handleCandidateAction(candidate, "approve")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                                                <CheckCircle size={18} />
                                                <span className="text-xs">{t("approve")}</span>
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </InfiniteScroll>
                    )}

                    {candidates.length === 0 && !loading && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p>{t("noDataFound")}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Candidates;