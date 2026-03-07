import { Plus, Trash2, Edit2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useState } from 'react';
import BannerModal from '@/components/admin/bannar/BannerModal';
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from '@/hooks/useAdmin';

const POSITIONS = [
  { value: 'header', label: 'Header (Banner trên cùng)' },
  { value: 'home_main', label: 'Trang chủ - Banner chính' },
  { value: 'home_promo', label: 'Trang chủ - Khuyến mãi' },
  { value: 'footer', label: 'Footer (Banner dưới cùng)' },
  { value: 'popup', label: 'Popup (Quảng cáo popup)' },
];

const BannerPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    position: 'home_main',
  });

  const { data: bannersData, isLoading } = useBanners();
  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();

  const banners = Array.isArray(bannersData) ? bannersData : [];

  const handleOpenModal = (banner = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        imageUrl: banner.imageUrl || '',
        position: banner.position || 'home_main',
      });
    } else {
      setEditingBanner(null);
      setFormData({ imageUrl: '', position: 'home_main' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBanner) {
      updateBannerMutation.mutate(
        { id: editingBanner.bannerId, data: formData },
        { onSuccess: () => setShowModal(false) }
      );
    } else {
      createBannerMutation.mutate(formData, {
        onSuccess: () => setShowModal(false),
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Xóa banner này?')) {
      deleteBannerMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Quản lý Banner</h1>
          <p className="text-[#4f5562]">
            Cấu hình hình ảnh quảng cáo hiển thị trên website
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f5dd9] text-white rounded-xl font-medium hover:bg-[#0b4fc0]"
        >
          <Plus size={18} /> Thêm banner
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Tổng banner', val: banners.length, color: 'text-gray-900' },
          ...POSITIONS.map((pos) => ({
            label: pos.label.split(' - ').pop() || pos.label,
            val: banners.filter((b) => b.position === pos.value).length,
            color: 'text-blue-600',
          })).filter((s) => s.val > 0),
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.val}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {POSITIONS.map((pos) => {
          const items = banners.filter((b) => b.position === pos.value);
          if (items.length === 0) return null;

          return (
            <div
              key={pos.value}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50/50 border-b flex justify-between items-center">
                <h3 className="font-bold text-[#222]">{pos.label}</h3>
                <span className="text-xs bg-white px-2 py-1 rounded-lg border text-gray-500">
                  {items.length} Banner
                </span>
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-gray-100">
                  {items.map((banner) => (
                    <tr
                      key={banner.bannerId}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            {banner.imageUrl ? (
                              <img
                                src={banner.imageUrl}
                                className="w-full h-full object-cover"
                                alt="banner"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="text-gray-300 w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-[#222] text-sm truncate max-w-xs">
                            {banner.imageUrl}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {banner.position}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(banner)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(banner.bannerId)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <BannerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSubmit}
        editingBanner={editingBanner}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default BannerPage;
