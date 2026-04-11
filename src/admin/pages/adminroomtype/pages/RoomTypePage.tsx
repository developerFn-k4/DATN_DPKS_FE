import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useRoomType } from '../hooks/RoomType';
import { getStorageUrl } from '../../../services/adminRoomTypeService';

const QuanLyRoomTypePage = () => {
  const navigate = useNavigate();
  const { roomTypes, loading, deleteRoomType } = useRoomType();

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Tiêu đề trang */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Quản Lý Loại Phòng</h1>
          <p className="text-sm text-gray-400">Danh sách các hạng phòng đang kinh doanh</p>
        </div>
        <button
          onClick={() => navigate('/admin/roomtype/new')}
          className="!bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-xl shadow-indigo-200 hover:scale-105 transition-all font-bold flex items-center gap-2"
        >
          <PlusOutlined /> Thêm loại phòng mới
        </button>
      </div>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-gray-400 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-gray-100">
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Ảnh</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Tên loại phòng</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Sức chứa</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Loại giường</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Diện tích</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Giá cơ bản</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="p-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {roomTypes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-20 text-center text-gray-400">
                    <PictureOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                    <p className="text-sm font-medium mt-2">Chưa có loại phòng nào.</p>
                    <button
                      onClick={() => navigate('/admin/roomtype/new')}
                      className="mt-3 text-indigo-600 text-sm font-bold hover:underline !bg-transparent"
                    >
                      Thêm mới ngay →
                    </button>
                  </td>
                </tr>
              ) : (
                roomTypes.map((rt) => {
                  // Hỗ trợ cả id và room_type_id
                  const id = rt.id ?? rt.room_type_id;
                  const thumb = rt.images?.[0];

                  return (
                    <tr key={id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* Thumbnail */}
                      <td className="p-4">
                        {thumb ? (
                          <img
                            src={getStorageUrl(thumb.image_url)}
                            alt={rt.name}
                            className="h-14 w-20 object-cover rounded-xl shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://placehold.co/80x56?text=No+img';
                            }}
                          />
                        ) : (
                          <div className="h-14 w-20 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                            <PictureOutlined />
                          </div>
                        )}
                      </td>

                      {/* Tên */}
                      <td className="p-5">
                        <div className="font-black text-slate-700 text-base">{rt.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">ID #{id}</div>
                      </td>

                      {/* Sức chứa */}
                      <td className="p-5 text-sm font-bold text-slate-600">
                        👤 {rt.capacity} người
                      </td>

                      {/* Loại giường */}
                      <td className="p-5">
                        <span className="text-[11px] bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-bold uppercase">
                          {rt.bed_type}
                        </span>
                      </td>

                      {/* Diện tích */}
                      <td className="p-5 text-sm font-bold text-slate-600">
                        📏 {rt.area} m²
                      </td>

                      {/* Giá cơ bản */}
                      <td className="p-5 font-black text-orange-500 text-base">
                        {Number(rt.base_price).toLocaleString('vi-VN')}
                        <span className="text-[10px] text-gray-400 font-normal ml-1">
                          {rt.currency}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="p-5">
                        <span
                          className={`px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-tight ${
                            rt.status === 'active'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-rose-100 text-rose-600'
                          }`}
                        >
                          {rt.status === 'active' ? '● Hoạt động' : '○ Tạm ngưng'}
                        </span>
                      </td>

                      {/* Hành động - hiện khi hover */}
                      <td className="p-5">
                        <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/admin/roomtype/${id}`)}
                            className="p-2.5 !bg-blue-100 text-blue-600 rounded-xl hover:!bg-blue-500 hover:text-white transition-all shadow-sm"
                            title="Xem chi tiết"
                          >
                            <EyeOutlined />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/roomtype/${id}/edit`)}
                            className="p-2.5 !bg-amber-100 text-amber-600 rounded-xl hover:!bg-amber-500 hover:text-white transition-all shadow-sm"
                            title="Chỉnh sửa"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            onClick={() => deleteRoomType(id!)}
                            className="p-2.5 !bg-rose-100 text-rose-600 rounded-xl hover:!bg-rose-500 hover:text-white transition-all shadow-sm"
                            title="Xóa"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuanLyRoomTypePage;
