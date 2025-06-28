import API from "@/lib/api";
import Swal from "sweetalert2";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import EditProfileModal from "./EditProfileModal";
import React, { useEffect, useState } from "react";
import Lightbox from "@/components/Common/Lightbox";
import AppPreferencesModal from "./AppPreferencesModal";
import { useLanguage } from "@/contexts/LanguageContext";
import ChangePassworodModal from "./ChangePassworodModal";
import { User, Mail, Phone, Edit3, Camera, Settings, Bell, Shield, LogOut, ChevronRight, AtSign, IdCard, Lock } from "lucide-react";

const ProfilePage: React.FC = () => {
    const { t } = useLanguage();

    const { user, refresh, logout } = useAuth();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        avatar: null as File | null,
    });

    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [avatarSrcValid, setAvatarSrcValid] = useState(true);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState("");

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isAppPreferencesOpen, setIsAppPreferencesOpen] = useState(false);

    const profileSections = [
        {
            title: t("accountSettings"),
            items: [
                { icon: User, label: t("personalInformation"), action: () => setIsEditingProfile(true) },
                { icon: Lock, label: t("changePassword"), action: () => setIsChangingPassword(true) },
                { icon: Bell, label: t("notifications"), action: () => {} },
                { icon: Shield, label: t("privacyAndSecurity"), action: () => {} },
                { icon: Settings, label: t("appPreferences"), action: () => setIsAppPreferencesOpen(true) },
            ],
        },
        {
            title: t("support"),
            items: [
                { icon: Mail, label: t("contactSupport"), action: () => {} },
                { icon: Phone, label: t("helpCenter"), action: () => {} },
            ],
        },
    ];

    const handleSave = async () => {
        const form = new FormData();
        form.append("id", user?.id || "");
        form.append("name", formData.name);
        form.append("username", formData.username);
        form.append("email", formData.email);
        form.append("phone", formData.phone);
        if (formData.avatar) form.append("avatar", formData.avatar);

        try {
            const response = await API.post("profile/update", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            swal("success", response.data.message);
            setIsEditingProfile(false);

            await refresh();
        } catch (err: any) {
            swal("error", err.response.data.message);
        }
    };

    useEffect(() => {
        if (previewAvatar) handleSave();
    }, [previewAvatar]);

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

    const handleLogout = () => {
        Swal.fire({
            title: t("confirmLogout"),
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            denyButtonText: t("logout"),
            cancelButtonText: t("cancel"),
            reverseButtons: true,
        }).then((result) => {
            if (result.isDenied) logout();
        });
    };

    return (
        <div className="p-6 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        {avatarSrcValid ? <img src={previewAvatar || import.meta.env.VITE_PUBLIC_URL + "directorApp/avatars/" + user?.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity" onClick={() => openLightbox(previewAvatar || import.meta.env.VITE_PUBLIC_URL + "directorApp/avatars/" + user?.avatar, user?.name || "")} onError={() => setAvatarSrcValid(false)} /> : <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl shadow-lg">{user?.name.charAt(0)}</div>}

                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <Camera size={14} />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFormData({ ...formData, avatar: file });
                                        setPreviewAvatar(URL.createObjectURL(file));
                                        setAvatarSrcValid(true);
                                    }
                                }}
                            />
                        </label>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold mb-1 text-gray-700 dark:text-white truncate">{user?.name}</h2>
                        <p className="text-gray-600 dark:text-gray-200 text-md truncate">{user?.username}</p>
                        <p className="text-gray-500 dark:text-gray-300 text-xs truncate">{user?.email}</p>
                    </div>
                    <button onClick={() => setIsEditingProfile(true)} className="p-3 bg-blue-600/10 hover:bg-blue-700/20 text-blue-700 border border-blue-700/20 dark:bg-white/10 dark:text-white/75 dark:hover:bg-white/20 dark:border-white/10 rounded-full transition-colors flex-shrink-0">
                        <Edit3 size={20} />
                    </button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("contactInformation")}</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                            <IdCard size={18} className="text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{t("fullName")}</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <AtSign size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{t("username")}</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">{user?.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                            <Mail size={18} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{t("emailAddress")}</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <Phone size={18} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{t("phoneNumber")}</p>
                            <p className="text-xs font-medium text-gray-900 dark:text-white">{user?.phone}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {profileSections.map((section, sectionIndex) => (
                <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + sectionIndex * 0.1 }} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
                    <div className="space-y-2">
                        {section.items.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <button key={index} onClick={item.action} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <Icon size={18} className="text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            ))}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center space-x-3 transition-colors">
                    <span>{t("logout")}</span>
                    <LogOut size={18} />
                </button>
            </motion.div>

            {lightboxOpen && <Lightbox image={lightboxImage} title={lightboxTitle} onClose={closeLightbox} />}

            {isEditingProfile && <EditProfileModal setIsEditingProfile={setIsEditingProfile} formData={formData} setFormData={setFormData} handleSave={handleSave} />}

            {isChangingPassword && <ChangePassworodModal setIsChangingPassword={setIsChangingPassword} />}

            {isAppPreferencesOpen && <AppPreferencesModal setIsAppPreferencesOpen={setIsAppPreferencesOpen} />}
        </div>
    );
};

export default ProfilePage;
