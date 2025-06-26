import { motion } from "framer-motion";
import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import { Employee, Education, Experience, Language, Organization, Skill, Certificate } from "@/types/employee";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, X, IdCard, User, Building2, Award, Globe, BookOpen, Heart, Shield, Clock, Badge, Users } from "lucide-react";

export const EmployeeDetail: React.FC = () => {
    const { t } = useLanguage();

    const navigate = useNavigate();

    const { employee } = useLocation().state as { employee: Employee };

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState("");

    const getWorkDuration = () => {
        if (!employee.tgl_mulai_kerja) return "0";

        const startDate = new Date(employee.tgl_mulai_kerja);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);

        if (years > 0) {
            return `${years} ${t("years")} ${months} ${t("months")}`;
        } else if (months > 0) {
            return `${months} ${t("months")}`;
        } else {
            return `${diffDays} ${t("days")}`;
        }
    };

    const getContractRemaining = () => {
        if (!employee.tgl_berakhir_kontrak) return "Permanent";

        const endDate = new Date(employee.tgl_berakhir_kontrak);
        const currentDate = new Date();
        const diffTime = endDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const years = Math.floor(diffDays / 365);
            const months = Math.floor((diffDays % 365) / 30);

            if (years > 0) {
                return `${years} ${t("years")} ${months} ${t("months")}`;
            } else if (months > 0) {
                return `${months} ${t("months")}`;
            } else {
                return `${diffDays} ${t("days")}`;
            }
        } else {
            return "Expired";
        }
    };

    const getStatusColor = (status_karyawan: Employee["status_karyawan"]) => {
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

    const calculateLanguageSkillScores = (skill: Language) => {
        const scores = [skill.baca, skill.tulis, skill.dengar, skill.bicara];
        const totalGot = scores.reduce((acc, b) => acc + b, 0);
        const percentage = (totalGot / 20) * 100;
        return percentage.toFixed(0);
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
                <div onClick={() => navigate("/employee")} className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowLeft size={18} className="text-gray-800" />
                    </button>
                    <h1 className="text-md font-bold text-gray-800 truncate">{t("employeeProfile")}</h1>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-sm">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-4">
                        {employee.image ? (
                            <img
                                src={import.meta.env.VITE_PUBLIC_URL + "Foto_Karyawan/" + employee.image}
                                alt="Employee Avatar"
                                className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                onClick={() => openLightbox(import.meta.env.VITE_PUBLIC_URL + "Foto_Karyawan/" + employee.image, employee.nama_lengkap)}
                                onError={e => {
                                    e.currentTarget.outerHTML = `<div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">${employee.nama_lengkap.charAt(0)}</div>`;
                                }}
                            />
                        ) : (
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">{employee.nama_lengkap.charAt(0)}</div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold mb-1">{employee.nama_lengkap}</h2>
                            <p className="text-indigo-100 text-md">{employee.jabatan.nama_jabatan}</p>
                            <p className="text-indigo-200 text-xs">
                                {employee.shio} & {employee.elemen}
                            </p>
                            <div className="mt-2 sm:hidden">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status_karyawan)}`}>{employee.status_karyawan}</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:block">
                        <div className={`px-4 py-2 ${getStatusColor(employee.status_karyawan)} backdrop-blur rounded-full transition-colors flex items-center justify-center space-x-2`}>
                            <span className={`font-medium text-sm uppercase`}>{employee.status_karyawan}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-xl font-bold">{getWorkDuration()}</p>
                        <p className="text-indigo-200 text-xs">{t("workPeriod")}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold">{employee.nik_karyawan}</p>
                        <p className="text-indigo-200 text-xs">{t("employeeId")}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold">{getContractRemaining()}</p>
                        <p className="text-indigo-200 text-xs truncate">{t("contractRemaining")}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("personalInformation")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("gender")}</p>
                            <small className="font-medium text-gray-900">{employee.jenis_kelamin}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("dateOfBirth")}</p>
                            <small className="font-medium text-gray-900">
                                {employee.tempat_lahir},{" "}
                                {new Date(employee.tanggal_lahir).toLocaleDateString("id-ID", {
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
                            <p className="text-sm text-gray-600 -mb-1">{t("companyEmail")}</p>
                            <small className="font-medium text-gray-900">{employee.email}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Mail size={18} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("personalEmail")}</p>
                            <small className="font-medium text-gray-900">{employee.email_pribadi || "-"}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("phoneNumber")}</p>
                            <small className="font-medium text-gray-900">{employee.no_telpon}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <IdCard size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("nationalId")}</p>
                            <small className="font-medium text-gray-900">{employee.nik_ktp}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <MapPin size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("address")}</p>
                            <small className="font-medium text-gray-900 inline-block max-w-[275px]">
                                {employee.alamat}, {employee.kota}, {employee.provinsi} {employee.kode_pos}
                            </small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                            <Heart size={18} className="text-pink-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("maritalStatus")}</p>
                            <small className="font-medium text-gray-900">{employee.status_pernikahan}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Shield size={18} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("religion")}</p>
                            <small className="font-medium text-gray-900">{employee.agama}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <Globe size={18} className="text-teal-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("nationality")}</p>
                            <small className="font-medium text-gray-900">
                                {employee.kebangsaan} - {employee.negara}
                            </small>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("employmentInformation")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Badge size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("position")}</p>
                            <small className="font-medium text-gray-900">{employee.jabatan.nama_jabatan}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Building2 size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("department")}</p>
                            <small className="font-medium text-gray-900">{employee.department}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Award size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("grade")}</p>
                            <small className="font-medium text-gray-900">
                                {employee.grade} - {employee.kategori_grade}
                            </small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Clock size={18} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("workStatus")}</p>
                            <small className="font-medium text-gray-900">{employee.status_pekerjaan}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Calendar size={18} className="text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("startDate")}</p>
                            <small className="font-medium text-gray-900">
                                {new Date(employee.tgl_mulai_kerja).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Calendar size={18} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 -mb-1">{t("contractEndDate")}</p>
                            <small className="font-medium text-gray-900">
                                {employee.tgl_berakhir_kontrak
                                    ? new Date(employee.tgl_berakhir_kontrak).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : "Permanent"}
                            </small>
                        </div>
                    </div>
                </div>
            </motion.div>

            {(employee.pendidikan || employee.pengalaman_kerja || employee.skill || employee.skill_bahasa || employee.organisasi || employee.sertifikat) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("professionalInformation")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {employee.pendidikan && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <GraduationCap size={18} className="text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t("education")}</p>
                                    {JSON.parse(employee.pendidikan)?.map((edu: Education, index: number) => (
                                        <p key={index} className="font-medium text-sm text-gray-900 mb-3">
                                            {edu.institusi}
                                            <br />
                                            <small className="text-xs">
                                                {edu.jenjang} - {edu.jurusan} ({new Date(edu.tahun_masuk).getFullYear()} - {new Date(edu.tahun_lulus).getFullYear()})
                                            </small>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {employee.pengalaman_kerja && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                    <Briefcase size={18} className="text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t("workExperience")}</p>
                                    {JSON.parse(employee.pengalaman_kerja)?.map((experience: Experience, index: number) => (
                                        <p key={index} className="font-medium text-sm text-gray-900 mb-3">
                                            {experience.nama_perusahaan}
                                            <br />
                                            <small className="text-xs">
                                                {experience.posisi_kerja} ({new Date(experience.mulai_kerja).getFullYear()} - {new Date(experience.akhir_kerja).getFullYear()})
                                            </small>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {employee.skill && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                    <Award size={18} className="text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t("skills")}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {JSON.parse(employee.skill)?.map((skill: Skill, index: number) => (
                                            <small key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                                                {skill.keahlian} ({skill.rate})
                                            </small>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {employee.skill_bahasa && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                                    <Globe size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t("languages")}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {JSON.parse(employee.skill_bahasa)?.map((language: Language, index: number) => (
                                            <small key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                                                {language.bahasa} ({calculateLanguageSkillScores(language)}%)
                                            </small>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {employee.organisasi && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Users size={18} className="text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t("organizations")}</p>
                                    {JSON.parse(employee.organisasi)?.map((organization: Organization, index: number) => (
                                        <p key={index} className="font-medium text-sm text-gray-900 mb-3">
                                            {organization.nama}
                                            <br />
                                            <small className="text-xs">
                                                {organization.posisi} ({new Date(organization.mulai_org).getFullYear()} - {new Date(organization.akhir_org).getFullYear()})
                                            </small>
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {employee.sertifikat && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <BookOpen size={18} className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">{t("certificates")}</p>
                                    {JSON.parse(employee.sertifikat)?.map((certificate: Certificate, index: number) => (
                                        <p key={index} className="font-medium text-sm text-gray-900 mb-3">
                                            {certificate.nama}
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
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};
