import { motion } from "framer-motion";
import React, { useState } from "react";
import Lightbox from "@/components/Common/Lightbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { Employee as EmployeeType, Education, Experience, Language, Organization, Skill, Certificate } from "@/types/employee";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, IdCard, User, Building2, Award, Globe, BookOpen, Heart, Shield, Clock, Badge, Users } from "lucide-react";

interface EmployeeDetailProps {
    employee: EmployeeType;
    onClose: () => void;
}

export const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee, onClose }) => {
    const { t } = useLanguage();

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState("");

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

    const calculateLanguageSkillScores = (skill: Language) => {
        const scores = [skill.baca, skill.tulis, skill.dengar, skill.bicara];
        const totalGot = scores.reduce((acc, b) => acc + b, 0);
        const percentage = (totalGot / 20) * 100;
        return percentage.toFixed(0);
    };

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
                <button onClick={onClose} className="text-white py-2 px-4 font-medium flex items-center justify-center space-x-2">
                    <ArrowLeft size={18} />
                    <span className="text-xs">{t("employeeProfile")}</span>
                </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
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
                            <h2 className="text-xl font-bold mb-1 text-gray-700 dark:text-white">{employee.nama_lengkap}</h2>
                            <p className="text-gray-600 dark:text-gray-200 text-md capitalize">{`${employee.jabatan.nama_jabatan}`}</p>
                            <p className="text-gray-500 dark:text-gray-300 text-xs">
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
                        <p className="text-xl font-bold text-gray-600 dark:text-white">{getWorkDuration()}</p>
                        <p className="text-gray-600 dark:text-gray-200 text-xs">{t("workPeriod")}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-600 dark:text-white">{employee.nik_karyawan}</p>
                        <p className="text-gray-600 dark:text-gray-200 text-xs">{t("employeeId")}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-600 dark:text-white truncate">{getContractRemaining()}</p>
                        <p className="text-gray-600 dark:text-gray-200 text-xs truncate">{t("contractRemaining")}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("personalInformation")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <User size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("gender")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.jenis_kelamin}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Calendar size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("dateOfBirth")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">
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
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <Mail size={18} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("companyEmail")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.email}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <Mail size={18} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("personalEmail")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.email_pribadi || "-"}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Phone size={18} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("phoneNumber")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.no_telpon}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <IdCard size={18} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("nationalId")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.nik_ktp}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <MapPin size={18} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300">{t("address")}</p>
                            <small className="font-medium text-gray-900 dark:text-white inline-block max-w-[275px]">
                                {employee.alamat}, {employee.kota}, {employee.provinsi} {employee.kode_pos}
                            </small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                            <Heart size={18} className="text-pink-600 dark:text-pink-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("maritalStatus")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.status_pernikahan}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <Shield size={18} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("religion")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.agama}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                            <Globe size={18} className="text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("nationality")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">
                                {employee.kebangsaan} - {employee.negara}
                            </small>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("employmentInformation")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Badge size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("position")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.jabatan.nama_jabatan}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Building2 size={18} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("department")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.department}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <Award size={18} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("grade")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">
                                {employee.grade} - {employee.kategori_grade}
                            </small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <Clock size={18} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("workStatus")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">{employee.status_pekerjaan}</small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <Calendar size={18} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("startDate")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">
                                {new Date(employee.tgl_mulai_kerja).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </small>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <Calendar size={18} className="text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-600 dark:text-gray-300 -mb-1">{t("contractEndDate")}</p>
                            <small className="font-medium text-gray-900 dark:text-white">
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("professionalInformation")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {employee.pendidikan && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                                    <GraduationCap size={18} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("education")}</p>
                                    {JSON.parse(employee.pendidikan)?.map((edu: Education, index: number) => (
                                        <p key={index} className="font-medium text-sm text-gray-900 dark:text-white mb-3">
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
                                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                                    <Briefcase size={18} className="text-teal-600 dark:text-teal-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("workExperience")}</p>
                                    {JSON.parse(employee.pengalaman_kerja)?.map((experience: Experience, index: number) => (
                                        <p key={index} className="font-medium text-sm text-gray-900 dark:text-white mb-3">
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
                                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                                    <Award size={18} className="text-pink-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("skills")}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {JSON.parse(employee.skill)?.map((skill: Skill, index: number) => (
                                            <small key={index} className="bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 px-3 py-1 rounded-full text-xs">
                                                {skill.keahlian} ({skill.rate})
                                            </small>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {employee.skill_bahasa && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                    <Globe size={18} className="text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("languages")}</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {JSON.parse(employee.skill_bahasa)?.map((language: Language, index: number) => (
                                            <small key={index} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs">
                                                {language.bahasa} ({calculateLanguageSkillScores(language)}%)
                                            </small>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {employee.organisasi && (
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                    <Users size={18} className="text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("organizations")}</p>
                                    {JSON.parse(employee.organisasi)?.map((organization: Organization, index: number) => (
                                        <p key={index} className="font-medium text-sm text-gray-900 dark:text-white mb-3">
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
                                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                    <BookOpen size={18} className="text-yellow-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{t("certificates")}</p>
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

            {lightboxOpen && <Lightbox image={lightboxImage} title={lightboxTitle} onClose={closeLightbox} />}
        </div>
    );
};
