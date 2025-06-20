import { motion } from "framer-motion";
import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit3, Camera, Settings, Bell, Shield, LogOut, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Swal from "sweetalert2";

const ProfilePage: React.FC = () => {
    const { t } = useLanguage();
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const profileSections = [
        {
            title: t("accountSettings"),
            items: [
                { icon: User, label: t("personalInformation"), action: () => setIsEditing(true) },
                { icon: Bell, label: t("notifications"), action: () => {} },
                { icon: Shield, label: t("privacyAndSecurity"), action: () => {} },
                { icon: Settings, label: t("appPreferences"), action: () => {} },
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

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure want to logout?",
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: false,
            denyButtonText: "Logout",
            reverseButtons: true,
        }).then(result => {
            if (result.isDenied) logout();
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <img src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} alt={user?.name} className="w-24 h-24 rounded-full border-4 border-white/20 object-cover" />
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                            <Camera size={14} />
                        </button>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
                        <p className="text-blue-100 mb-2">{user?.username}</p>
                        <p className="text-blue-200 text-sm">{user?.email}</p>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <Edit3 size={20} />
                    </button>
                </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("contactInformation")}</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("emailAddress")}</p>
                            <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Phone size={18} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("phoneNumber")}</p>
                            <p className="font-medium text-gray-900">{user?.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <MapPin size={18} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{t("officeLocation")}</p>
                            <p className="font-medium text-gray-900">Jakarta, Indonesia</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Profile Sections */}
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
                                        <span className="font-medium text-gray-900">{item.label}</span>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            ))}

            {/* Logout Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center space-x-3 transition-colors">
                    <span>{t("logout")}</span>
                    <LogOut size={20} />
                </button>
            </motion.div>

            {/* Edit Modal Placeholder */}
            {isEditing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setIsEditing(false)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input type="text" defaultValue={user?.name} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <input type="tel" defaultValue={user?.phone} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-6">
                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => setIsEditing(false)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default ProfilePage;
