'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCamera, faSave } from '@fortawesome/free-solid-svg-icons';
import { uploadUserAvatar, uploadUserBanner } from "@/apis";
import { useAuth } from "@/hooks/useAuth";

export default function EditProfilePopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const user = useAuth();

    // Disable scroll on body when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState(user.user?.displayName || "");
    const [bio, setBio] = useState(user?.user?.bio || "");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Chỉ đóng nếu click trực tiếp vào overlay, không phải vào content bên trong
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Khi chọn file mới cho avatar
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // Khi chọn file mới cho banner
    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    // Hàm lưu tất cả thay đổi
    const handleSaveAll = async () => {
        setLoading(true);
        try {
            // Upload avatar nếu có file mới
            if (avatarFile) {
                await uploadUserAvatar(avatarFile);
            }
            // Upload banner nếu có file mới
            if (bannerFile) {
                await uploadUserBanner(bannerFile);
            }
            
            onClose();
        } catch (err) {
            alert("Có lỗi xảy ra khi lưu thay đổi!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed py-14 inset-0 z-50 bg-black/50 flex justify-center" onClick={handleOverlayClick}>
            <div className="w-full max-w-2xl bg-[#1c1c2e] rounded-lg shadow-lg border border-[#3a3a5a] flex flex-col max-h-[calc(100vh-3.5rem)] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#3a3a5a]">
                    <h2 className="text-lg font-semibold">Chỉnh sửa trang cá nhân</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <FontAwesomeIcon icon={faXmark} size="lg" />
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="px-6 py-4 overflow-y-auto">
                    {/* Banner */}
                    <div className="mb-6">
                        <label className="text-sm block text-gray-300 mb-2">Ảnh bìa</label>
                        <div className="relative h-32 bg-gray-700 rounded overflow-hidden">
                            <img src={bannerPreview || user?.user?.bannerUrl || "/assets/9285000.jpg"} alt="Cover" className="w-full h-full object-cover" />
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={bannerInputRef}
                                onChange={handleBannerChange}
                            />
                            <button
                                className="absolute bottom-2 right-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 text-sm rounded text-white"
                                onClick={() => bannerInputRef.current?.click()}
                                disabled={loading}
                            >
                                <FontAwesomeIcon icon={faCamera} className="pr-2 fa-lg" />
                                Đổi ảnh nền
                            </button>
                        </div>
                    </div>

                    {/* Avatar */}
                    <div className="mb-6">
                        <label className="text-sm block text-gray-300 mb-2">Ảnh đại diện</label>
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 bg-gray-500 rounded-full overflow-hidden flex items-center justify-center">
                                {avatarPreview || user?.user?.avatarUrl ? (
                                    <img src={avatarPreview || user?.user?.avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-black text-sm">Avatar</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                            <button
                                className="bg-[#2a2a4a] hover:bg-[#3a3a6a] px-3 py-2 rounded text-sm"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                            >
                                <FontAwesomeIcon icon={faCamera} className="pr-2 fa-lg" />
                                Đổi ảnh đại diện
                            </button>
                        </div>
                    </div>

                    {/* Display name */}
                    <div className="mb-6">
                        <label className="text-sm block text-gray-300 mb-2">Tên hiển thị</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-[#0f0f1f] border border-[#3a3a5a] rounded text-white text-sm"
                            placeholder="Nhập tên của bạn"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                        <label className="text-sm block text-gray-300 mb-2">Tiểu sử</label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-2 bg-[#0f0f1f] border border-[#3a3a5a] rounded text-white text-sm"
                            placeholder="Giới thiệu bản thân"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            disabled={loading}
                        ></textarea>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 py-4 border-t border-[#3a3a5a]">
                    <button
                        onClick={handleSaveAll}
                        className="bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded text-sm font-semibold"
                        disabled={loading}
                    >
                        {loading ? "Đang lưu..." : <><FontAwesomeIcon icon={faSave} className="pr-2 fa-lg" /> Lưu thay đổi</>}
                    </button>
                </div>
            </div>
        </div>
    );
}