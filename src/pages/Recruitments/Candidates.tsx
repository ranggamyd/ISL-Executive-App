import API from "@/lib/api";
import Swal from "sweetalert2";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useRef, useState } from "react";
import { CandidateDetail } from "./CandidateDetail";
import Lightbox from "@/components/Common/Lightbox";
import { useUserAccess } from "@/hooks/useUserAccess";
import { CheckCircle, Eye, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NoDataFound from "@/components/Common/NoDataFound";
import { ListSkeleton } from "@/components/Common/Skeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import { Candidate as CandidateType } from "@/types/candidate";
import SearchInputWithFilter from "@/components/Common/SearchInputWithFilter";

interface CandidatesProps extends React.HTMLAttributes<HTMLDivElement> {
    showTitle?: boolean;
}

const Candidates = ({ showTitle = true, ...props }: CandidatesProps) => {
    const { t } = useLanguage();

    const [loading, setLoading] = useState(false);
    const [candidates, setCandidates] = useState<CandidateType[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebounce(searchTerm, 1000);
    const filterRef = useRef<HTMLDivElement>(null);
    const [filterOpen, setFilterOpen] = useState<boolean>(false);
    const [uniquePositions, setUniquePositions] = useState<{ id: string; nama_jabatan: string }[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<string>("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

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

    const clearFilters = (): void => {
        setSelectedPosition("");
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

    const calculateYOE = (months_of_experience: number) => {
        const months = months_of_experience;
        const years = Math.floor(months / 12);

        const remainingMonths = months % 12;

        return `${years},${remainingMonths} years`;
    };

    if (showDetail && selectedCandidate) {
        return <CandidateDetail candidate={selectedCandidate} yoe={calculateYOE(selectedCandidate.months_of_experience)} onClose={() => setShowDetail(false)} />;
    }

    const theme = document.documentElement.classList.contains("dark") ? "dark" : "light";

    const handleCandidateAction = (candidate: CandidateType, action: "view" | "approve" | "reject") => {
        if (action === "view") {
            setSelectedCandidate(candidate);
            setShowDetail(true);
        } else {
            Swal.fire({
                theme: theme,
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
                        const { data } = await API.post(`recruitment/${action}Candidate`, { id: candidate.id });

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

    return (
        <div className={`space-y-4 ${props.style?.padding === 0 ? '' : 'p-6'}`} {...props}>
            {showTitle && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
                    <h2 className={`text-2xl font-bold mb-1 ${props.style?.padding === 0 ? 'text-gray-800 dark:text-white' : 'text-white'}`}>{t("candidateList")}</h2>
                </motion.div>
            )}

            <SearchInputWithFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterRef={filterRef} filterOpen={filterOpen} setFilterOpen={setFilterOpen} clearFilters={clearFilters}>
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
            </SearchInputWithFilter>

            {loading ? (
                <ListSkeleton items={searchTerm ? 1 : 3} />
            ) : candidates.length < 1 ? (
                <NoDataFound />
            ) : (
                <InfiniteScroll className="space-y-3 mb-3" style={{ overflow: "hidden !important" }} dataLength={candidates.length} next={loadMore} hasMore={hasMore} loader={<ListSkeleton items={3} />}>
                    {candidates.map((candidate, index) => (
                        <motion.div key={candidate.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                            <div onClick={() => handleCandidateAction(candidate, "view")} className="flex items-start justify-between mb-4">
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

            {lightboxOpen && <Lightbox image={lightboxImage} title={lightboxTitle} onClose={closeLightbox} />}
        </div>
    );
};

export default Candidates;