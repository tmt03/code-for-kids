'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { faEdit, faLock, faPlus, faSearch, faTrash, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface User {
    id: string;
    username: string;
    displayName: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
    avatarUrl?: string;
}

export default function AccountManagementPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Mock data for development
    const mockUsers: User[] = [
        {
            id: "1",
            username: "user1",
            displayName: "Nguyễn Văn A",
            email: "user1@example.com",
            role: "student",
            status: "active",
            createdAt: "2024-01-15",
            avatarUrl: "/assets/mascots/original.png"
        },
        {
            id: "2",
            username: "user2",
            displayName: "Trần Thị B",
            email: "user2@example.com",
            role: "premium",
            status: "active",
            createdAt: "2024-01-20",
            avatarUrl: "/assets/mascots/original.png"
        },
        {
            id: "3",
            username: "user3",
            displayName: "Lê Văn C",
            email: "user3@example.com",
            role: "student",
            status: "suspended",
            createdAt: "2024-02-01",
            avatarUrl: "/assets/mascots/original.png"
        }
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setUsers(mockUsers);
            setFilteredUsers(mockUsers);
            setIsLoading(false);
        }, 1000);
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleStatusToggle = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === "active" ? "suspended" : "active";

        try {
            // Simulate API call
            setUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            ));

            toast.success(`Đã ${newStatus === "active" ? "mở khóa" : "khóa"} tài khoản thành công`);
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
            try {
                // Simulate API call
                setUsers(prev => prev.filter(user => user.id !== userId));
                toast.success("Đã xóa tài khoản thành công");
            } catch (error) {
                toast.error("Có lỗi xảy ra khi xóa tài khoản");
            }
        }
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const getStatusColor = (status: string) => {
        return status === "active" ? "text-green-600" : "text-red-600";
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin": return "text-red-600";
            case "premium": return "text-purple-600";
            case "student": return "text-blue-600";
            default: return "text-gray-600";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#E8F1F2] to-[#D3E0E1] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3D62] mx-auto"></div>
                    <p className="mt-4 text-[#0A3D62] font-semibold">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#E8F1F2] to-[#D3E0E1] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-[#0A3D62] border border-white rounded-lg p-6 text-white mb-6">
                    <h1 className="text-3xl font-bold mb-2">👥 Quản lý tài khoản người dùng</h1>
                    <p className="text-gray-300">Thêm, sửa, xóa và quản lý quyền truy cập của người dùng</p>
                </div>

                {/* Search and Add User */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm theo tên, username hoặc email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-[#0A3D62] focus:border-[#00A8B5]"
                            />
                        </div>
                        <Button className="bg-[#00A8B5] hover:bg-[#0096A5] text-white">
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            Thêm người dùng mới
                        </Button>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0A3D62] text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left">Người dùng</th>
                                    <th className="px-6 py-3 text-left">Email</th>
                                    <th className="px-6 py-3 text-left">Vai trò</th>
                                    <th className="px-6 py-3 text-left">Trạng thái</th>
                                    <th className="px-6 py-3 text-left">Ngày tạo</th>
                                    <th className="px-6 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <img
                                                    src={user.avatarUrl || "/assets/mascots/original.png"}
                                                    alt={user.displayName}
                                                    className="w-10 h-10 rounded-full mr-3"
                                                />
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.displayName}</div>
                                                    <div className="text-sm text-gray-500">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                                                {user.role === "admin" ? "Admin" :
                                                    user.role === "premium" ? "Premium" : "Học sinh"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                                                {user.status === "active" ? "Hoạt động" : "Đã khóa"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="pixel"
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-blue-600 hover:bg-blue-50"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={user.status === "active" ? "pixelDanger" : "pixelGreen"}
                                                    onClick={() => handleStatusToggle(user.id, user.status)}
                                                >
                                                    <FontAwesomeIcon icon={user.status === "active" ? faLock : faUnlock} />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="pixelDanger"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Không tìm thấy người dùng nào</p>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                        <div className="text-2xl font-bold text-[#0A3D62]">{users.length}</div>
                        <div className="text-gray-600">Tổng người dùng</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {users.filter(u => u.status === "active").length}
                        </div>
                        <div className="text-gray-600">Đang hoạt động</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {users.filter(u => u.role === "premium").length}
                        </div>
                        <div className="text-gray-600">Tài khoản Premium</div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {users.filter(u => u.status === "suspended").length}
                        </div>
                        <div className="text-gray-600">Đã khóa</div>
                    </div>
                </div>
            </div>
        </div>
    );
}