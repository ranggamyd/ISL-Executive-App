import API from "@/lib/api";
import Swal from "sweetalert2";
import swal from "@/utils/swal";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { User, Mail, Phone, Edit3, Camera, Settings, Bell, Shield, LogOut, ChevronRight, X, AtSign, IdCard, Lock, Eye, EyeOff, Globe, Palette, Sun, Moon, MonitorCog } from "lucide-react";

const languages = [
    { code: "en" as Language, name: "English", flag: "🇺🇸" },
    { code: "id" as Language, name: "Indonesian", flag: "🇮🇩" },
    { code: "zh" as Language, name: "Chinese", flag: "🇨🇳" },
];

const themes = [
    { key: "light", icon: Sun, label: "Light" },
    { key: "dark", icon: Moon, label: "Dark" },
    { key: "system", icon: MonitorCog, label: "System" },
];

const ProfilePage: React.FC = () => {
    const { t } = useLanguage();
    const { language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();

    const { user, refresh, logout } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isAppPreferencesOpen, setIsAppPreferencesOpen] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [formData, setFormData] = useState({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        avatar: null as File | null,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [avatarSrcValid, setAvatarSrcValid] = useState(true);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxImage, setLightboxImage] = useState("");
    const [lightboxTitle, setLightboxTitle] = useState("");

    const profileSections = [
        {
            title: t("accountSettings"),
            items: [
                { icon: User, label: t("personalInformation"), action: () => setIsEditing(true) },
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
            setIsEditing(false);

            await refresh();
        } catch (err: any) {
            swal("error", err.response.data.message);
        }
    };

    const handleChangePassword = async () => {
        try {
            const response = await API.post("profile/updatePassword", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword,
            });

            swal("success", response.data.message);
            setIsChangingPassword(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err: any) {
            if (err.response.data?.errors) {
                Object.keys(err.response.data.errors).forEach((key) => {
                    swal("error", err.response.data.errors[key]);
                });
            } else if (err.response.data?.message) {
                swal("error", err.response.data.message);
            } else {
                swal("error", "Something went wrong");
            }
        }
    };

    const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    useEffect(() => {
        if (previewAvatar) handleSave();
    }, [previewAvatar]);

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
                        <img src={lightboxImage} alt={lightboxTitle} className="max-w-full max-h-full object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
                        {lightboxTitle && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 rounded-b-lg">
                                <h3 className="text-lg font-semibold">{lightboxTitle}</h3>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        {avatarSrcValid ? <img src={previewAvatar || import.meta.env.VITE_PUBLIC_URL + "directorApp/avatars/" + user?.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-75 transition-opacity" onClick={() => openLightbox(previewAvatar || import.meta.env.VITE_PUBLIC_URL + "directorApp/" + user?.avatar, user?.name || "")} onError={() => setAvatarSrcValid(false)} /> : <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl shadow-lg">{user?.name.charAt(0)}</div>}

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
                        <h2 className="text-xl font-bold mb-1 truncate">{user?.name}</h2>
                        <p className="text-blue-100 mb-0 truncate">{user?.username}</p>
                        <p className="text-blue-200 text-sm truncate">{user?.email}</p>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors flex-shrink-0">
                        <Edit3 size={20} />
                    </button>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("contactInformation")}</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <IdCard size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("fullName")}</p>
                            <p className="text-xs font-medium text-gray-900">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <AtSign size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("username")}</p>
                            <p className="text-xs font-medium text-gray-900">{user?.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Mail size={18} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("emailAddress")}</p>
                            <p className="text-xs font-medium text-gray-900">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("phoneNumber")}</p>
                            <p className="text-xs font-medium text-gray-900">{user?.phone}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {profileSections.map((section, sectionIndex) => (
                <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + sectionIndex * 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                    <div className="space-y-2">
                        {section.items.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <button key={index} onClick={item.action} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                            <Icon size={18} className="text-gray-600" />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
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

            {/* Edit Profile Modal */}
            {isEditing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ marginTop: 0, zIndex: 51 }} onClick={() => setIsEditing(false)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("editProfile")}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("fullName")}</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("username")}</label>
                                <input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("emailAddress")}</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("phoneNumber")}</label>
                                <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-6">
                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors">
                                {t("cancel")}
                            </button>
                            <button onClick={handleSave} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                {t("saveChanges")}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Change Password Modal */}
            {isChangingPassword && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ marginTop: 0, zIndex: 51 }} onClick={() => setIsChangingPassword(false)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <Lock size={18} className="text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{t("changePassword")}</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("currentPassword")}</label>
                                <div className="relative">
                                    <input type={showPasswords.current ? "text" : "password"} value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" required />
                                    <button type="button" onClick={() => togglePasswordVisibility("current")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("newPassword")}</label>
                                <div className="relative">
                                    <input type={showPasswords.new ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" required />
                                    <button type="button" onClick={() => togglePasswordVisibility("new")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t("confirmNewPassword")}</label>
                                <div className="relative">
                                    <input type={showPasswords.confirm ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="••••••••" required />
                                    <button type="button" onClick={() => togglePasswordVisibility("confirm")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                            <button
                                onClick={() => {
                                    setIsChangingPassword(false);
                                    setPasswordData({
                                        currentPassword: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });
                                }}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
                            >
                                {t("cancel")}
                            </button>
                            <button onClick={handleChangePassword} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                {t("changePassword")}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* App Preferences Modal */}
            {isAppPreferencesOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ marginTop: 0, zIndex: 51 }} onClick={() => setIsAppPreferencesOpen(false)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Settings size={18} className="text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{t("appPreferences")}</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <Globe size={18} className="text-gray-600" />
                                    <label className="text-sm font-medium text-gray-700">{t("language")}</label>
                                </div>
                                <div className="space-y-2">
                                    {languages.map((lang) => (
                                        <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${language === lang.code ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}>
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg">{lang.flag}</span>
                                                <span className="text-sm font-medium">{t(lang.name.toLowerCase())}</span>
                                            </div>
                                            {language === lang.code && (
                                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center space-x-3 mb-3">
                                    <Palette size={18} className="text-gray-600" />
                                    <label className="text-sm font-medium text-gray-700">{t("theme")}</label>
                                </div>
                                <div className="space-y-2">
                                    {themes.map((themeOption) => {
                                        const Icon = themeOption.icon;
                                        return (
                                            <button key={themeOption.key} onClick={() => setTheme(themeOption.key as any)} className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${theme === themeOption.key ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-200 hover:bg-gray-50 text-gray-700"}`}>
                                                <div className="flex items-center space-x-3">
                                                    <Icon size={18} />
                                                    <span className="text-sm font-medium">{t(themeOption.label.toLowerCase())}</span>
                                                </div>
                                                {theme === themeOption.key && (
                                                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button onClick={() => setIsAppPreferencesOpen(false)} className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                                {t("close") || "Close"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default ProfilePage;
