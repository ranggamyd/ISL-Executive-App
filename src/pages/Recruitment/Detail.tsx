import API from "@/lib/api";
import Swal from "sweetalert2";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Candidate, Certificate, Education, Experience, Language, Organization, Skill } from "@/types/candidate";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, X, Clock, Award, MessageSquare, VenusAndMars, Medal, IdCard, Globe, Building2, ScrollText, ThumbsUp, ThumbsDown, XCircle, CheckCircle } from "lucide-react";

export const Detail: React.FC = () => {
    const { t } = useLanguage();

    const navigate = useNavigate();

    const { candidate, yoe } = useLocation().state as { candidate: Candidate; yoe: string };

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState("");

    const interviewScore = (() => {
        const hrdReview = candidate.review_recruitment;

        const hrdScores = [hrdReview.kepercayaan_diri, hrdReview.pengetahuan_perusahaan, hrdReview.kemampuan_komunikasi, hrdReview.pengetahuan_jobs, hrdReview.antusias_perusahaan, hrdReview.motivasi_kerja];
        const userScore = candidate.review_user?.user_competensi || 0;

        const totalHrd = hrdScores.reduce((acc, item) => acc + parseInt(item.toString()), 0);
        const totalScores = userScore ? totalHrd + parseInt(userScore.toString()) : totalHrd;

        const totalMax = userScore ? 35 : 30;
        const percentage = (totalScores / totalMax) * 100;

        return percentage.toFixed(1);
    })();

    const calculateLanguageSkillScores = (skill: any) => {
        const scores = [skill.baca, skill.tulis, skill.dengar, skill.bicara];
        const totalGot = scores.reduce((a, b) => parseInt(a) + parseInt(b), 0);
        const percentage = (totalGot / 20) * 100;

        return percentage.toFixed(0);
    };

    const handleCandidateAction = async (action: "approve" | "reject") => {
        let titleKey = "";
        let endpoint = "";

        if (candidate.status === "APPROVE INTERVIEW HRD") {
            titleKey = `confirm_${action}Candidate`;
            endpoint = `${action}Candidate`;
        }

        if (candidate.status === "APPROVE OFFERING SALARY HRD") {
            titleKey = `confirm_${action}Salary`;
            endpoint = `${action}Salary`;
        }

        Swal.fire({
            title: t(titleKey),
            confirmButtonText: t(action),
            cancelButtonText: t("cancel"),
            confirmButtonColor: action === "approve" ? "#22C55E" : "#EF4444",
            showCancelButton: true,
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                try {
                    const { data } = await API.post(`recruitment/${endpoint}`, {
                        id: candidate.id,
                    });

                    swal("success", data.message);
                    navigate("/recruitment", { replace: true });
                } catch (err: any) {
                    swal("error", err.response.data.message);
                }
            }
        });
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
        <div className="p-6 space-y-6">
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

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
                <div onClick={() => navigate("/recruitment")} className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft size={18} className="text-gray-800" />
                    </button>
                    <h1 className="text-md font-bold text-gray-800 truncate">{t("resume")}</h1>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex space-x-4">
                    <button onClick={() => handleCandidateAction("reject")} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm">
                        <XCircle size={18} />
                        <span className="text-xs">{t("reject")}</span>
                    </button>
                    <button onClick={() => handleCandidateAction("approve")} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm">
                        <CheckCircle size={18} />
                        <span className="text-xs">{t("approve")}</span>
                    </button>
                </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-4">
                        <img
                            src={import.meta.env.VITE_PUBLIC_URL + "recruitment/foto/" + candidate.foto_selfie}
                            alt="Candidate Avatar"
                            className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                            onClick={() => openLightbox(import.meta.env.VITE_PUBLIC_URL + "recruitment/foto/" + candidate.foto_selfie, candidate.nama_lengkap)}
                            onError={e => {
                                e.currentTarget.outerHTML = `<div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">${candidate.nama_lengkap.charAt(0)}</div>`;
                            }}
                        />
                        <div>
                            <h2 className="text-xl font-bold mb-1">{candidate.nama_lengkap}</h2>
                            <p className="text-blue-100 text-md capitalize">{`${candidate.jabatan.nama_jabatan}`}</p>
                            <p className="text-blue-200 text-xs">
                                {candidate.shio} & {candidate.elemen}
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <div className="p-2 bg-gray-100/50 backdrop-blur rounded-full transition-colors flex items-center justify-center space-x-2">
                            <Clock size={18} className="text-gray-800" />
                            <span className="font-medium text-xs text-gray-800">{candidate.status}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-xl font-bold">{yoe}</p>
                        <p className="text-blue-200 text-xs">{t("experiences")}</p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-xl font-bold">
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            }).format(candidate.salary_user || 0)}
                        </p>
                        <p className="text-blue-200 text-xs text-center">{t("expectedSalary")}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold">{interviewScore}%</p>
                        <p className="text-blue-200 text-xs">{t("interviewScores")}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("contactInformation")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <VenusAndMars size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("genderAndAge")}</p>
                            <small className="font-medium text-gray-900">
                                {candidate.gender}, {candidate.umur} {t("yearsOld")}
                            </small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("dateOfBirth")}</p>
                            <small className="font-medium text-gray-900">
                                {candidate.tempat_lahir},{" "}
                                {new Date(candidate.tanggal_lahir).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Mail size={18} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("email")}</p>
                            <small className="font-medium text-gray-900">{candidate.email}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("phoneNumber")}</p>
                            <small className="font-medium text-gray-900">{candidate.no_hp}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <IdCard size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("identityCardAddress")}</p>
                            <small className="font-medium text-gray-900 inline-block max-w-[275px]">{candidate.alamat_ktp}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <MapPin size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("domisileAddress")}</p>
                            <small className="font-medium text-gray-900 inline-block max-w-[275px]">{candidate.alamat_domisili}</small>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("ProfessionalInformation")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <GraduationCap size={18} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("educations")}</p>
                            {candidate.pendidikan ? (
                                JSON.parse(candidate.pendidikan)?.map((edu: Education, index: number) => (
                                    <p key={index} className="font-medium text-sm text-gray-900 mb-3">
                                        {edu.institusi}
                                        <br />
                                        <small className="text-xs">
                                            {edu.jenjang} - {edu.jurusan} ({new Date(edu.tahun_masuk).getFullYear()} - {new Date(edu.tahun_lulus).getFullYear()})
                                        </small>
                                    </p>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500">{t("noEducationsAvailable")}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <Building2 size={18} className="text-teal-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("workExperiences")}</p>
                            {candidate.pengalaman_kerja ? (
                                JSON.parse(candidate.pengalaman_kerja)?.map((experience: Experience, index: number) => (
                                    <p key={index} className="font-medium text-sm text-gray-900 mb-3">
                                        {experience.nama_perusahaan}, {experience.lokasi_perusahaan}
                                        <br />
                                        <small className="text-xs">
                                            {experience.posisi_kerja} ({new Date(experience.mulai_kerja).getFullYear()} - {new Date(experience.akhir_kerja).getFullYear()})
                                        </small>
                                    </p>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500">{t("noWorkExperiencesAvailable")}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Briefcase size={18} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("organizations")}</p>
                            {candidate.organisasi ? (
                                JSON.parse(candidate.organisasi)?.map((organization: Organization, index: number) => (
                                    <p key={index} className="font-medium text-sm text-gray-900 mb-3">
                                        {organization.posisi}, {organization.nama}
                                        <br />
                                        <small className="text-xs">
                                            {organization.tipe} ({new Date(organization.mulai_org).getFullYear()} - {new Date(organization.akhir_org).getFullYear()})
                                        </small>
                                    </p>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500">{t("noOrganizationsAvailable")}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Medal size={18} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("certificates")}</p>
                            {candidate.sertifikat ? (
                                JSON.parse(candidate.sertifikat)?.map((certificate: Certificate, index: number) => (
                                    <p key={index} className="font-medium text-sm text-gray-900 mb-3">
                                        {certificate.tipe}, {certificate.nama}
                                        <br />
                                        <small className="text-xs">
                                            {certificate.deskripsi} (
                                            {new Date(certificate.tanggal_sertifikasi).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                            )
                                        </small>
                                    </p>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500">{t("noCertificatesAvailable")}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <Award size={18} className="text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("skills")}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {candidate.skill ? (
                                    JSON.parse(candidate.skill)?.map((skill: Skill, index: number) => (
                                        <small key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                                            {skill.keahlian} ({skill.rate})
                                        </small>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500">{t("noSkillsAvailable")}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                            <Globe size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("languages")}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {candidate.skill_bahasa ? (
                                    JSON.parse(candidate.skill_bahasa)?.map((language: Language, index: number) => (
                                        <small key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                                            {language.bahasa} ({calculateLanguageSkillScores(language)}%)
                                        </small>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-500">{t("noLanguagesAvailable")}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("recruitmentReviews")}</h3>
                <div className="flex justify-between">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <ScrollText size={18} className="text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600">{t("abilityScores")}</p>
                    </div>
                    <div className="flex items-center">
                        {candidate.review_recruitment.kesimpulan.toLowerCase() === "recommend" ? (
                            <div className="px-3 py-2 space-x-2 bg-green-200 rounded-full flex items-center justify-center">
                                <ThumbsUp size={12} className="text-green-600" />
                                <small className="font-medium text-xs text-gray-600 uppercase">{t("recommended")}</small>
                            </div>
                        ) : candidate.review_recruitment.kesimpulan === "hold" ? (
                            <div className="px-3 py-2 space-x-2 bg-blue-100 rounded-full flex items-center justify-center">
                                <Clock size={12} className="text-blue-600" />
                                <small className="font-medium text-xs text-gray-600 uppercase">{t("holded")}</small>
                            </div>
                        ) : candidate.review_recruitment.kesimpulan === "not_recommend" || candidate.review_recruitment.kesimpulan === "Not Recommend" ? (
                            <div className="px-3 py-2 space-x-2 bg-red-100 rounded-full flex items-center justify-center">
                                <ThumbsDown size={12} className="text-red-600" />
                                <small className="font-medium text-xs text-gray-600 uppercase truncate">{t("notRecommended")}</small>
                            </div>
                        ) : (
                            <div className="px-3 py-2 space-x-2 bg-gray-100 rounded-full flex items-center justify-center">
                                <Clock size={12} className="text-gray-600" />
                                <small className="font-medium text-xs text-gray-600 uppercase">{t("other")}</small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-4">
                        {[
                            { label: "Kepercayaan Diri", value: candidate.review_recruitment.kepercayaan_diri || 3 },
                            { label: "Kemampuan Komunikasi", value: candidate.review_recruitment.kemampuan_komunikasi || 3 },
                            { label: "Antusias Perusahaan", value: candidate.review_recruitment.antusias_perusahaan || 3 },
                        ].map((skill, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-gray-700 mb-0">{skill.label}</span>
                                    <span className="text-xs text-gray-500">{skill.value}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <motion.div className="bg-teal-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${(skill.value / 5) * 100}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: "Pengetahuan Perusahaan", value: candidate.review_recruitment.pengetahuan_perusahaan || 3 },
                            { label: "Pengetahuan Jobs", value: candidate.review_recruitment.pengetahuan_jobs || 3 },
                            { label: "Motivasi Kerja", value: candidate.review_recruitment.motivasi_kerja || 3 },
                        ].map((skill, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-gray-700">{skill.label}</span>
                                    <span className="text-xs text-gray-500">{skill.value}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <motion.div className="bg-teal-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${(skill.value / 5) * 100}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Additional Notes */}
                <div className="w-full mt-7">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare size={18} className="text-green-600" />
                        </div>
                        <p className="text-sm text-gray-600">{t("interviewNotes")}</p>
                    </div>

                    <textarea value={candidate.review_recruitment.catatan} className="mt-2 w-full h-52 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-600" readOnly />

                    <p className="text-xs text-gray-500 mt-2 italic">
                        {t("approvedBy")} <strong>{candidate.approve_interview_hrd_by && parseInt(candidate.approve_interview_hrd_by) > 0 ? candidate.approve_hrd.nama_lengkap : candidate.approve_interview_hrd_by}</strong> {t("at")}:{" "}
                        {new Date(candidate.approve_interview_hrd_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
