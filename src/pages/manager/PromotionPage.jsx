import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Ticket,
  CheckCircle,
  XCircle,
  X,
} from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import {
  usePromotions,
  useCreatePromotion,
  useUpdatePromotion,
  useDeletePromotion,
  useTogglePromotion,
} from '@/hooks/useAdmin';

const PromotionPage = () => {
  const { data: coupons = [], isLoading } = usePromotions();
  const createPromotionMutation = useCreatePromotion();
  const updatePromotionMutation = useUpdatePromotion();
  const deletePromotionMutation = useDeletePromotion();
  const togglePromotionMutation = useTogglePromotion();

  const [couponSearch, setCouponSearch] = useState('');
  const [couponFilter, setCouponFilter] = useState('all');

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discountType: 'PERCENT',
    value: 0,
    minOrder: 0,
    maxDiscount: 0,
    usageLimit: null,
    description: '',
    isActive: true,
  });

  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
  });

  // ─── Handlers ────────────────────────────────────────────

  const handleCouponSubmit = (e) => {
    e.preventDefault();

    const payload = {
      code: couponFormData.code,
      discountType: couponFormData.discountType,
      value: Number(couponFormData.value),
      minOrder: Number(couponFormData.minOrder) || 0,
      maxDiscount: Number(couponFormData.maxDiscount) || 0,
      usageLimit: couponFormData.usageLimit ? Number(couponFormData.usageLimit) : null,
      description: couponFormData.description,
      isActive: couponFormData.isActive,
    };

    if (editingCoupon) {
      updatePromotionMutation.mutate(
        { id: editingCoupon.promotionId, data: payload },
        {
          onSuccess: () => {
            setShowCouponModal(false);
            setEditingCoupon(null);
          },
        }
      );
    } else {
      createPromotionMutation.mutate(payload, {
        onSuccess: () => {
          setShowCouponModal(false);
          setEditingCoupon(null);
        },
      });
    }
  };

  const toggleCouponStatus = (coupon) => {
    togglePromotionMutation.mutate(coupon.promotionId);
  };

  const openEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      minOrder: coupon.minOrder || 0,
      maxDiscount: coupon.maxDiscount || 0,
      usageLimit: coupon.usageLimit,
      description: coupon.description || '',
      isActive: coupon.isActive,
    });
    setShowCouponModal(true);
  };

  const openAddCoupon = () => {
    setEditingCoupon(null);
    setCouponFormData({
      code: '',
      discountType: 'PERCENT',
      value: 0,
      minOrder: 0,
      maxDiscount: 0,
      usageLimit: null,
      description: '',
      isActive: true,
    });
    setShowCouponModal(true);
  };

  const handleDeleteRequest = (id) => {
    setConfirmDelete({ isOpen: true, id });
  };

  const onConfirmDelete = () => {
    deletePromotionMutation.mutate(confirmDelete.id);
    setConfirmDelete({ isOpen: false, id: null });
  };

  // ─── Derived data ────────────────────────────────────────

  const filteredCoupons = coupons.filter((c) => {
    const matchesSearch = c.code
      .toLowerCase()
      .includes(couponSearch.toLowerCase());

    if (couponFilter === 'active') return matchesSearch && c.isActive;
    if (couponFilter === 'disabled') return matchesSearch && !c.isActive;
    return matchesSearch;
  });

  const isPercent = (type) =>
    type === 'PERCENT' || type === 'PERCENTAGE';

  const formatDiscount = (coupon) => {
    if (isPercent(coupon.discountType)) return `${coupon.value}%`;
    return Number(coupon.value).toLocaleString() + '₫';
  };

  const formatCurrency = (val) => {
    if (!val || Number(val) === 0) return '—';
    return Number(val).toLocaleString() + '₫';
  };

  // ─── Stats ───────────────────────────────────────────────

  const totalVouchers = coupons.length;
  const activeVouchers = coupons.filter((c) => c.isActive).length;
  const disabledVouchers = totalVouchers - activeVouchers;
  const totalUsage = coupons.reduce((s, c) => s + (c.usageCount || 0), 0);

  const Stat = ({ icon: Icon, label, value, color = 'text-gray-700' }) => (
    <div className="bg-white border rounded-xl p-5 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg bg-gray-50 ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Voucher</h1>
          <p className="text-gray-500 text-sm">Tạo và quản lý mã giảm giá</p>
        </div>

        <button
          onClick={openAddCoupon}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
        >
          <Plus size={16} />
          Tạo Voucher
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-5">
        <Stat icon={Ticket} label="Tổng voucher" value={totalVouchers} />
        <Stat icon={CheckCircle} label="Đang hoạt động" value={activeVouchers} color="text-green-600" />
        <Stat icon={XCircle} label="Đã tắt" value={disabledVouchers} color="text-gray-400" />
        <Stat icon={Ticket} label="Lượt sử dụng" value={totalUsage} color="text-blue-600" />
      </div>

      {/* VOUCHER TABLE */}
      <div className="bg-white border rounded-xl">
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <Ticket size={18} />
            Danh sách Voucher
          </h2>

          <div className="flex gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input
                value={couponSearch}
                onChange={(e) => setCouponSearch(e.target.value)}
                placeholder="Tìm theo mã..."
                className="pl-8 pr-3 py-2 border rounded-lg text-sm w-48"
              />
            </div>

            <select
              value={couponFilter}
              onChange={(e) => setCouponFilter(e.target.value)}
              className="border rounded-lg text-sm px-3 py-2"
            >
              <option value="all">Tất cả</option>
              <option value="active">Đang hoạt động</option>
              <option value="disabled">Đã tắt</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-gray-400">Đang tải...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            {couponSearch || couponFilter !== 'all'
              ? 'Không tìm thấy voucher nào'
              : 'Chưa có voucher nào. Nhấn "Tạo Voucher" để bắt đầu.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="text-left p-3 font-medium">Mã</th>
                  <th className="text-left p-3 font-medium">Loại</th>
                  <th className="text-left p-3 font-medium">Giảm giá</th>
                  <th className="text-left p-3 font-medium">Đơn tối thiểu</th>
                  <th className="text-left p-3 font-medium">Giảm tối đa</th>
                  <th className="text-left p-3 font-medium">Sử dụng</th>
                  <th className="text-left p-3 font-medium">Mô tả</th>
                  <th className="text-left p-3 font-medium">Trạng thái</th>
                  <th className="text-right p-3 font-medium"></th>
                </tr>
              </thead>

              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.promotionId || coupon.code} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <span className="font-mono font-semibold bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {coupon.code}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500">
                      {isPercent(coupon.discountType) ? 'Phần trăm' : 'Cố định'}
                    </td>

                    <td className="p-3 font-semibold text-blue-700">
                      {formatDiscount(coupon)}
                    </td>

                    <td className="p-3 text-gray-600">
                      {formatCurrency(coupon.minOrder)}
                    </td>

                    <td className="p-3 text-gray-600">
                      {formatCurrency(coupon.maxDiscount)}
                    </td>

                    <td className="p-3">
                      <span className="text-gray-700">
                        {coupon.usageCount || 0}
                      </span>
                      <span className="text-gray-400">
                        /{coupon.usageLimit || '∞'}
                      </span>
                    </td>

                    <td className="p-3 text-gray-500 max-w-[200px] truncate" title={coupon.description}>
                      {coupon.description || '—'}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => toggleCouponStatus(coupon)}
                        disabled={togglePromotionMutation.isPending}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors
                        ${
                          coupon.isActive
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => openEditCoupon(coupon)}
                        className="mr-2 text-gray-500 hover:text-blue-600"
                        title="Sửa"
                      >
                        <Edit2 size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteRequest(coupon.promotionId)}
                        className="text-gray-500 hover:text-red-600"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VOUCHER MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white rounded-t-xl">
              <h3 className="font-semibold text-lg">
                {editingCoupon ? 'Sửa Voucher' : 'Tạo Voucher mới'}
              </h3>
              <button
                onClick={() => { setShowCouponModal(false); setEditingCoupon(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCouponSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã voucher</label>
                <input
                  type="text"
                  value={couponFormData.code}
                  onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                  placeholder="VD: SUMMER20"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  required
                  disabled={!!editingCoupon}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                  <select
                    value={couponFormData.discountType}
                    onChange={(e) => setCouponFormData({ ...couponFormData, discountType: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="PERCENT">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định (₫)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá trị {isPercent(couponFormData.discountType) ? '(%)' : '(₫)'}
                  </label>
                  <input
                    type="number"
                    value={couponFormData.value}
                    onChange={(e) => setCouponFormData({ ...couponFormData, value: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu (₫)</label>
                  <input
                    type="number"
                    value={couponFormData.minOrder}
                    onChange={(e) => setCouponFormData({ ...couponFormData, minOrder: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giảm tối đa (₫)</label>
                  <input
                    type="number"
                    value={couponFormData.maxDiscount}
                    onChange={(e) => setCouponFormData({ ...couponFormData, maxDiscount: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng</label>
                <input
                  type="number"
                  value={couponFormData.usageLimit || ''}
                  onChange={(e) => setCouponFormData({ ...couponFormData, usageLimit: e.target.value ? Number(e.target.value) : null })}
                  placeholder="Để trống = không giới hạn"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={couponFormData.description}
                  onChange={(e) => setCouponFormData({ ...couponFormData, description: e.target.value })}
                  placeholder="Mô tả khuyến mãi..."
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={couponFormData.isActive}
                  onChange={(e) => setCouponFormData({ ...couponFormData, isActive: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="couponActive" className="text-sm text-gray-700">Kích hoạt ngay</label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCouponModal(false); setEditingCoupon(null); }}
                  className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createPromotionMutation.isPending || updatePromotionMutation.isPending}
                  className="px-5 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {createPromotionMutation.isPending || updatePromotionMutation.isPending
                    ? 'Đang lưu...'
                    : editingCoupon ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn chắc chắn muốn xóa voucher này?"
        onConfirm={onConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, id: null })}
        type="danger"
      />
    </div>
  );
};

export default PromotionPage;
