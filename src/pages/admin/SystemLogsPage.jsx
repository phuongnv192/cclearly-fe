import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Search, Download, Eye, Calendar, User, X, Loader2 } from 'lucide-react'
import { useAdminLogs } from '@/hooks/useAdmin'

const SystemLogsPage = () => {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [page, setPage] = useState(0)
  const [selectedLog, setSelectedLog] = useState(null)

  const { data: logsData, isLoading } = useAdminLogs({
    action: actionFilter || undefined,
    page,
    size: 20,
  })

  const logs = logsData?.items || []
  const meta = logsData?.meta || {}

  // Client-side search filter (the API may not support text search)
  const filteredLogs = searchTerm
    ? logs.filter(log =>
        (log.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.userName || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : logs

  const getActionBadge = (action) => {
    const badges = {
      import_stock: 'bg-blue-100 text-blue-700',
      add_product: 'bg-green-100 text-green-700',
      add_voucher: 'bg-purple-100 text-purple-700',
      change_banner: 'bg-orange-100 text-orange-700',
      change_email_template: 'bg-cyan-100 text-cyan-700',
      ban_account: 'bg-red-100 text-red-700',
      create_account: 'bg-emerald-100 text-emerald-700',
      reset_password: 'bg-amber-100 text-amber-700',
      CREATE: 'bg-green-100 text-green-700',
      UPDATE: 'bg-blue-100 text-blue-700',
      DELETE: 'bg-red-100 text-red-700',
      LOGIN: 'bg-purple-100 text-purple-700',
    }
    return badges[action] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#222]">Nhật ký hệ thống</h1>
          <p className="text-[#4f5562]">Theo dõi các hoạt động trong hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0f5dd9] text-white rounded-xl font-medium hover:bg-[#0b4fc0] transition-colors">
          <Download size={18} />
          Xuất log
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo người dùng hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]/20 focus:border-[#0f5dd9]"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5dd9]/20 focus:border-[#0f5dd9] bg-white cursor-pointer"
          >
            <option value="">Tất cả</option>
            <option value="CREATE">Tạo mới</option>
            <option value="UPDATE">Cập nhật</option>
            <option value="DELETE">Xóa</option>
            <option value="LOGIN">Đăng nhập</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Người thực hiện</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hành động</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chi tiết</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => (
                <tr key={log.logId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-[#222]">{log.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getActionBadge(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#4f5562] max-w-xs truncate">
                    {log.details}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-2 text-gray-400 hover:text-[#0f5dd9] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        
        {!isLoading && filteredLogs.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Không tìm thấy kết quả nào khớp với bộ lọc</p>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Trang {(meta.page ?? 0) + 1} / {meta.totalPages} ({meta.totalElements} bản ghi)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= (meta.totalPages ?? 1) - 1}
                className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-bold text-[#222]">Chi tiết nhật ký hoạt động</h3>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Hành động</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${getActionBadge(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Người thực hiện</p>
                  <p className="font-medium text-[#222]">{selectedLog.userName}</p>
                </div>
              </div>
              {(selectedLog.oldValue || selectedLog.newValue) && (
                <div className="grid grid-cols-2 gap-6">
                  {selectedLog.oldValue && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Giá trị cũ</p>
                      <div className="text-[#4f5562] bg-red-50 p-3 rounded-xl border border-red-100 text-sm">{selectedLog.oldValue}</div>
                    </div>
                  )}
                  {selectedLog.newValue && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Giá trị mới</p>
                      <div className="text-[#4f5562] bg-green-50 p-3 rounded-xl border border-green-100 text-sm">{selectedLog.newValue}</div>
                    </div>
                  )}
                </div>
              )}
              <div className="pt-4 border-t border-gray-50">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Chi tiết</p>
                <div className="text-[#4f5562] bg-gray-50 p-4 rounded-xl border border-gray-100 leading-relaxed">
                  {selectedLog.details}
                </div>
              </div>
            </div>
            <div className="p-5 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-6 py-2 bg-white border border-gray-200 text-[#222] rounded-xl hover:bg-gray-100 font-semibold transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SystemLogsPage