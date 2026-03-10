import {
  Lock,
  User,
  LogOut,
  ShoppingBag,
  Edit2,
  MapPin,
  Loader2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  useUserProfile,
  useUpdateProfile,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/hooks/useUser';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user: jwtUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);

  // ── Profile API ──
  const { data: profileData, isLoading: profileLoading } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const profile = profileData; // { userId, email, fullName, phoneNumber, isEmailVerified, role }

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
  });

  // Sync form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }, [profile]);

  // ── Address API ──
  const { data: addressesData, isLoading: addressesLoading } = useAddresses();
  const addresses = addressesData || [];
  const createAddressMutation = useCreateAddress();
  const updateAddressMutation = useUpdateAddress();
  const deleteAddressMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    name: '',
    phone: '',
    address: '',
    isDefault: false,
  });

  if (!isAuthenticated) {
    return (
      <div className="bg-[#ececec] min-h-screen py-10">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 text-center py-20">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-3xl font-bold text-[#222] mb-4">
            Vui lòng đăng nhập
          </h2>
          <p className="text-[#4f5562] mb-8">Đăng nhập để quản lý tài khoản</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#141f36] text-white px-10 py-4 rounded-full font-medium hover:bg-[#0d1322] transition"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  // ── Handlers ──
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddressMutation.mutate(
        { addressId: editingAddress.addressId, data: addressFormData },
        {
          onSuccess: () => {
            setShowAddressForm(false);
            setEditingAddress(null);
            resetAddressForm();
          },
        }
      );
    } else {
      createAddressMutation.mutate(addressFormData, {
        onSuccess: () => {
          setShowAddressForm(false);
          resetAddressForm();
        },
      });
    }
  };

  const handleDeleteAddress = (addressId) => {
    deleteAddressMutation.mutate(addressId);
  };

  const handleSetDefault = (addressId) => {
    setDefaultMutation.mutate(addressId);
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressFormData({
      name: addr.name || '',
      phone: addr.phone || '',
      address: addr.address || '',
      isDefault: addr.isDefault || false,
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressFormData({
      name: '',
      phone: '',
      address: '',
      isDefault: false,
    });
  };

  const getRoleLabel = (role) => {
    const labels = {
      CUSTOMER: 'Khách hàng',
      SALES_STAFF: 'Nhân viên bán hàng',
      OPERATION_STAFF: 'Nhân viên vận hành',
      MANAGER: 'Quản lý',
      ADMIN: 'Quản trị viên',
    };
    return labels[role] || role;
  };

  const displayName = profile?.fullName || jwtUser?.sub || 'User';
  const displayEmail = profile?.email || jwtUser?.sub || '';
  const displayRole = profile?.role || jwtUser?.role || '';

  return (
    <div className="bg-[#ececec] min-h-screen py-10">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#222] tracking-[-0.02em]">
            Tài khoản
          </h1>
          <p className="text-[#4f5562] mt-2">Quản lý thông tin cá nhân</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-[#0f5dd9] rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-[#222]">
                  {displayName}
                </h2>
                <p className="text-[#4f5562]">{displayEmail}</p>
                <span className="inline-block mt-2 text-xs bg-[#ececec] px-3 py-1 rounded-full text-[#222]">
                  {getRoleLabel(displayRole)}
                </span>
              </div>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition ${activeTab === 'info' ? 'bg-[#0f5dd9] text-white' : 'text-[#4f5562] hover:bg-[#f3f3f3]'}`}
                >
                  <User className="w-5 h-5" />
                  Thông tin tài khoản
                </button>
                {displayRole === 'CUSTOMER' && (
                  <>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition ${activeTab === 'addresses' ? 'bg-[#0f5dd9] text-white' : 'text-[#4f5562] hover:bg-[#f3f3f3]'}`}
                    >
                      <MapPin className="w-5 h-5" />
                      Sổ địa chỉ
                    </button>
                    <button
                      onClick={() => navigate('/orders')}
                      className="w-full text-left px-4 py-3 text-[#4f5562] hover:bg-[#f3f3f3] rounded-xl transition font-medium flex items-center gap-2"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Lịch sử đơn hàng
                    </button>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition font-medium flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {activeTab === 'info' ? (
              <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#222]">
                    Thông tin cá nhân
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-[#0f5dd9] hover:underline font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </button>
                </div>

                {profileLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0f5dd9]" />
                  </div>
                ) : isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-[#222] mb-2">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#222] mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full px-5 py-3 border border-[#e0e0e0] rounded-full focus:outline-none focus:border-[#0f5dd9] bg-[#f9f9f9]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                      className="bg-[#141f36] text-white px-8 py-3 rounded-full hover:bg-[#0d1322] transition font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      {updateProfileMutation.isPending && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      Lưu thay đổi
                    </button>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-5">
                      <div className="bg-[#f3f3f3] p-4 rounded-xl">
                        <p className="text-sm text-[#4f5562] mb-1">Họ tên</p>
                        <p className="font-semibold text-[#222]">
                          {profile?.fullName || 'Chưa cập nhật'}
                        </p>
                      </div>
                      <div className="bg-[#f3f3f3] p-4 rounded-xl">
                        <p className="text-sm text-[#4f5562] mb-1">Email</p>
                        <p className="font-semibold text-[#222]">
                          {profile?.email || displayEmail}
                        </p>
                      </div>
                      <div className="bg-[#f3f3f3] p-4 rounded-xl">
                        <p className="text-sm text-[#4f5562] mb-1">
                          Số điện thoại
                        </p>
                        <p className="font-semibold text-[#222]">
                          {profile?.phoneNumber || 'Chưa cập nhật'}
                        </p>
                      </div>
                      <div className="bg-[#f3f3f3] p-4 rounded-xl">
                        <p className="text-sm text-[#4f5562] mb-1">Vai trò</p>
                        <p className="font-semibold text-[#222]">
                          {getRoleLabel(displayRole)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(13,22,39,0.06)] p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-[#222]">Sổ địa chỉ</h2>
                  {!showAddressForm && (
                    <button
                      onClick={() => {
                        setEditingAddress(null);
                        resetAddressForm();
                        setShowAddressForm(true);
                      }}
                      className="text-sm font-bold bg-[#141f36] text-white px-6 py-2 rounded-full hover:bg-[#0d1322] transition"
                    >
                      Thêm địa chỉ mới
                    </button>
                  )}
                </div>

                {addressesLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0f5dd9]" />
                  </div>
                ) : showAddressForm ? (
                  <form
                    onSubmit={handleAddressSubmit}
                    className="bg-[#f9f9f9] p-6 rounded-2xl border border-[#e0e0e0] mb-8 space-y-4"
                  >
                    <h3 className="font-bold text-[#222] mb-4">
                      {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Địa chỉ mới'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#4f5562] mb-2 uppercase">
                          Tên gợi nhớ (Ví dụ: Nhà riêng)
                        </label>
                        <input
                          type="text"
                          required
                          value={addressFormData.name}
                          onChange={(e) =>
                            setAddressFormData({
                              ...addressFormData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0f5dd9]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#4f5562] mb-2 uppercase">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          required
                          value={addressFormData.phone}
                          onChange={(e) =>
                            setAddressFormData({
                              ...addressFormData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0f5dd9]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#4f5562] mb-2 uppercase">
                        Địa chỉ chi tiết
                      </label>
                      <textarea
                        required
                        value={addressFormData.address}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0f5dd9] h-20 resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={addressFormData.isDefault}
                        onChange={(e) =>
                          setAddressFormData({
                            ...addressFormData,
                            isDefault: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-[#0f5dd9]"
                      />
                      <label
                        htmlFor="isDefault"
                        className="text-sm text-[#4f5562]"
                      >
                        Đặt làm địa chỉ mặc định
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={
                          createAddressMutation.isPending ||
                          updateAddressMutation.isPending
                        }
                        className="bg-[#0f5dd9] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#0d4fb8] transition disabled:opacity-50 flex items-center gap-2"
                      >
                        {(createAddressMutation.isPending ||
                          updateAddressMutation.isPending) && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        {editingAddress ? 'Cập nhật' : 'Thêm mới'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                        }}
                        className="bg-gray-200 text-[#222] px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-300 transition"
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.addressId}
                        className="border border-[#e0e0e0] rounded-2xl p-6 relative hover:border-[#0f5dd9] transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-[#222]">
                              {addr.name}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] bg-blue-50 text-[#0f5dd9] px-2 py-0.5 rounded-md font-bold uppercase">
                                Mặc định
                              </span>
                            )}
                          </div>
                          <div className="flex gap-4">
                            {!addr.isDefault && (
                              <button
                                onClick={() =>
                                  handleSetDefault(addr.addressId)
                                }
                                disabled={setDefaultMutation.isPending}
                                className="text-xs text-[#4f5562] font-medium hover:text-[#0f5dd9] disabled:opacity-50"
                              >
                                Thiết lập mặc định
                              </button>
                            )}
                            <button
                              onClick={() => openEditAddress(addr)}
                              className="text-xs text-[#0f5dd9] font-medium hover:underline"
                            >
                              Sửa
                            </button>
                            {!addr.isDefault && (
                              <button
                                onClick={() =>
                                  handleDeleteAddress(addr.addressId)
                                }
                                disabled={deleteAddressMutation.isPending}
                                className="text-xs text-red-500 font-medium hover:underline disabled:opacity-50"
                              >
                                Xóa
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-[#4f5562] group-hover:text-[#222] transition-colors">
                          {addr.address}
                        </p>
                        <p className="text-xs text-[#4f5562] mt-2">
                          SĐT: {addr.phone}
                        </p>
                      </div>
                    ))}
                    {addresses.length === 0 && (
                      <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-sm text-gray-400">
                          Bạn chưa có địa chỉ nào trong sổ địa chỉ.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
