import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import toast, { Toaster } from 'react-hot-toast';
import {
  roomTypeService,
  getStorageUrl,
  type RoomTypeImage,
} from '../../../services/adminRoomTypeService';

// ===================== CONSTANTS =====================

// Các loại giường phổ biến
const BED_TYPES = ['King', 'Queen', 'Double', 'Twin', 'Single', 'Bunk'];

// Gợi ý tiện nghi nhanh
const QUICK_AMENITIES = [
  'WiFi',
  'TV',
  'Điều hòa',
  'Minibar',
  'Bồn tắm',
  'Vòi sen',
  'Két sắt',
  'Máy sấy tóc',
  'Ban công',
  'View biển',
  'Bãi đậu xe',
  'Phòng tắm riêng',
];

// Tailwind class dùng chung cho form
const LABEL = 'text-[11px] font-black text-gray-500 uppercase tracking-wider mb-1 block';
const INPUT =
  'w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all bg-white text-sm';
const INPUT_ERR =
  'w-full border-2 border-red-400 p-2.5 rounded-xl focus:ring-2 focus:ring-red-100 outline-none transition-all bg-white text-sm';

// ===================== TYPES =====================

interface FormValues {
  hotel_id: string;
  name: string;
  capacity: string;
  bed_type: string;
  area: string;
  base_price: string;
  currency: string;
  status: 'active' | 'inactive';
}

interface FormErrors {
  name?: string;
  capacity?: string;
  bed_type?: string;
  area?: string;
  base_price?: string;
}

// ===================== COMPONENT =====================

const RoomTypeForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // isEdit = true khi URL có param :id
  const isEdit = Boolean(id);

  // --- State form ---
  const [values, setValues] = useState<FormValues>({
    hotel_id: '1',
    name: '',
    capacity: '2',
    bed_type: '',
    area: '',
    base_price: '',
    currency: 'VND',
    status: 'active',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // --- State tiện nghi ---
  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState('');

  // --- State ảnh ---
  // Ảnh cũ từ server (khi edit)
  const [existingImages, setExistingImages] = useState<RoomTypeImage[]>([]);
  // Set ID ảnh cũ muốn giữ lại
  const [keepImageIds, setKeepImageIds] = useState<Set<number>>(new Set());
  // Ảnh mới người dùng chọn upload
  const [newImages, setNewImages] = useState<File[]>([]);

  // --- State loading ---
  const [pageLoading, setPageLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ===================== LOAD DATA KHI EDIT =====================
  useEffect(() => {
    if (!isEdit || !id) return;
    setPageLoading(true);
    roomTypeService
      .getById(id)
      .then((data) => {
        // Điền sẵn dữ liệu vào form
        setValues({
          hotel_id: String(data.hotel_id ?? 1),
          name: data.name ?? '',
          capacity: String(data.capacity ?? 2),
          bed_type: data.bed_type ?? '',
          area: String(data.area ?? ''),
          base_price: String(data.base_price ?? ''),
          currency: data.currency ?? 'VND',
          status: data.status ?? 'active',
        });
        setAmenities(data.amenities ?? []);
        const imgs = data.images ?? [];
        setExistingImages(imgs);
        // Mặc định giữ tất cả ảnh cũ
        setKeepImageIds(new Set(imgs.map((img) => img.id)));
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Không thể tải thông tin';
        toast.error(msg);
        navigate('/admin/roomtype');
      })
      .finally(() => setPageLoading(false));
  }, [id, isEdit, navigate]);

  // ===================== VALIDATE =====================
  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!values.name.trim()) errs.name = 'Vui lòng nhập tên loại phòng';
    if (!values.capacity || Number(values.capacity) < 1) errs.capacity = 'Sức chứa phải >= 1';
    if (!values.bed_type.trim()) errs.bed_type = 'Vui lòng chọn loại giường';
    if (!values.area || Number(values.area) < 1) errs.area = 'Diện tích phải >= 1 m²';
    if (!values.base_price || Number(values.base_price) < 0) errs.base_price = 'Giá không hợp lệ';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ===================== HANDLERS =====================

  // Cập nhật 1 field của form và xóa lỗi tương ứng
  const handleChange = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Thêm tiện nghi từ input (hoặc nhấn Enter)
  const addAmenity = () => {
    const val = amenityInput.trim();
    if (val && !amenities.includes(val)) {
      setAmenities((prev) => [...prev, val]);
    }
    setAmenityInput('');
  };

  // Toggle chọn nhanh tiện nghi từ danh sách gợi ý
  const toggleQuickAmenity = (a: string) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  // Xóa 1 tiện nghi khỏi danh sách đã chọn
  const removeAmenity = (a: string) => setAmenities((prev) => prev.filter((x) => x !== a));

  // Toggle giữ/bỏ ảnh cũ khi edit
  const toggleKeepImage = (imgId: number) => {
    setKeepImageIds((prev) => {
      const next = new Set(prev);
      if (next.has(imgId)) next.delete(imgId);
      else next.add(imgId);
      return next;
    });
  };

  // Xóa ảnh mới khỏi danh sách preview
  const removeNewImage = (idx: number) =>
    setNewImages((prev) => prev.filter((_, i) => i !== idx));

  // Xử lý chọn file ảnh mới
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setNewImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    // Reset input để có thể chọn lại cùng file
    e.target.value = '';
  };

  // ===================== SUBMIT =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Vui lòng kiểm tra lại các trường bắt buộc');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();

    // Các trường cơ bản
    formData.append('hotel_id', values.hotel_id);
    formData.append('name', values.name.trim());
    formData.append('capacity', values.capacity);
    formData.append('bed_type', values.bed_type.trim());
    formData.append('area', values.area);
    formData.append('base_price', values.base_price);
    formData.append('currency', values.currency);
    formData.append('status', values.status);

    // Tiện nghi (lọc rỗng)
    amenities.filter((a) => a.trim()).forEach((a) => formData.append('amenities[]', a));

    // Khi edit: gửi danh sách ID ảnh cũ muốn giữ lại
    // Backend sẽ xóa những ảnh không có trong danh sách này
    if (isEdit) {
      keepImageIds.forEach((imgId) => formData.append('keep_images[]', String(imgId)));
    }

    // Ảnh mới
    newImages.forEach((file) => formData.append('images[]', file));

    try {
      if (isEdit && id) {
        await roomTypeService.update(id, formData);
        toast.success('Cập nhật loại phòng thành công!');
      } else {
        await roomTypeService.create(formData);
        toast.success('Thêm loại phòng thành công!');
      }
      navigate('/admin/roomtype');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ===================== RENDER: Loading =====================
  if (pageLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
        <p className="text-sm text-gray-400 font-medium">Đang tải thông tin...</p>
      </div>
    );
  }

  // ===================== RENDER: Form =====================
  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Breadcrumb + tiêu đề */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/roomtype')}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-all !bg-transparent"
          title="Quay lại"
        >
          <ArrowLeftOutlined className="text-lg" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            {isEdit ? 'Chỉnh sửa loại phòng' : 'Thêm loại phòng mới'}
          </h1>
          <p className="text-sm text-gray-400">
            {isEdit ? `Đang chỉnh sửa ID #${id}` : 'Điền thông tin để tạo hạng phòng mới'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ========== CỘT TRÁI (2/3): Nội dung chính ========== */}
        <div className="lg:col-span-2 space-y-6">
          {/* ---- Thông tin cơ bản ---- */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">
              Thông tin cơ bản
            </h2>

            {/* Tên loại phòng */}
            <div className="mb-4">
              <label className={LABEL}>
                Tên loại phòng <span className="text-red-400 normal-case">*</span>
              </label>
              <input
                value={values.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="VD: Deluxe Double Ocean View"
                className={errors.name ? INPUT_ERR : INPUT}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Sức chứa + Loại giường */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={LABEL}>
                  Sức chứa (người) <span className="text-red-400 normal-case">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={values.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  className={errors.capacity ? INPUT_ERR : INPUT}
                />
                {errors.capacity && (
                  <p className="text-red-400 text-xs mt-1">{errors.capacity}</p>
                )}
              </div>
              <div>
                <label className={LABEL}>
                  Loại giường <span className="text-red-400 normal-case">*</span>
                </label>
                <select
                  value={values.bed_type}
                  onChange={(e) => handleChange('bed_type', e.target.value)}
                  className={errors.bed_type ? INPUT_ERR : INPUT}
                >
                  <option value="">-- Chọn loại giường --</option>
                  {BED_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.bed_type && (
                  <p className="text-red-400 text-xs mt-1">{errors.bed_type}</p>
                )}
              </div>
            </div>

            {/* Diện tích + Giá + Tiền tệ */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={LABEL}>
                  Diện tích (m²) <span className="text-red-400 normal-case">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={values.area}
                  onChange={(e) => handleChange('area', e.target.value)}
                  placeholder="30"
                  className={errors.area ? INPUT_ERR : INPUT}
                />
                {errors.area && <p className="text-red-400 text-xs mt-1">{errors.area}</p>}
              </div>
              <div>
                <label className={LABEL}>
                  Giá cơ bản <span className="text-red-400 normal-case">*</span>
                </label>
                <input
                  type="number"
                  min={0}
                  value={values.base_price}
                  onChange={(e) => handleChange('base_price', e.target.value)}
                  placeholder="1000000"
                  className={errors.base_price ? INPUT_ERR : INPUT}
                />
                {errors.base_price && (
                  <p className="text-red-400 text-xs mt-1">{errors.base_price}</p>
                )}
              </div>
              <div>
                <label className={LABEL}>Tiền tệ</label>
                <select
                  value={values.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className={INPUT}
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
          </div>

          {/* ---- Tiện nghi ---- */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">
              Tiện nghi
            </h2>

            {/* Gợi ý nhanh: click để toggle */}
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_AMENITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleQuickAmenity(a)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
                    amenities.includes(a)
                      ? '!bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>

            {/* Input thủ công */}
            <div className="flex gap-2">
              <input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
                placeholder="Nhập tiện nghi khác rồi nhấn Enter hoặc Thêm..."
                className={INPUT + ' flex-1'}
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 !bg-indigo-600 text-white rounded-xl font-bold hover:!bg-indigo-700 transition-colors flex items-center gap-1"
              >
                <PlusOutlined />
              </button>
            </div>

            {/* Danh sách tiện nghi đã chọn */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                {amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-1 bg-white border border-indigo-200 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
                  >
                    {a}
                    <button
                      type="button"
                      onClick={() => removeAmenity(a)}
                      className="text-indigo-300 hover:text-red-500 ml-0.5 !bg-transparent"
                    >
                      <CloseOutlined style={{ fontSize: '10px' }} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ---- Thư viện ảnh ---- */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">
              Thư viện ảnh
            </h2>

            {/* Ảnh cũ - chỉ hiển thị khi edit */}
            {isEdit && existingImages.length > 0 && (
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 mb-2">
                  Ảnh hiện tại — click để giữ/xóa khi lưu:
                </p>
                <div className="flex flex-wrap gap-3">
                  {existingImages.map((img) => {
                    const kept = keepImageIds.has(img.id);
                    return (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => toggleKeepImage(img.id)}
                        className={`relative w-24 h-24 rounded-xl overflow-hidden border-4 transition-all !bg-transparent ${
                          kept
                            ? 'border-indigo-500 shadow-md'
                            : 'border-transparent opacity-40 grayscale'
                        }`}
                        title={kept ? 'Click để xóa ảnh này' : 'Click để giữ lại ảnh này'}
                      >
                        <img
                          src={getStorageUrl(img.image_url)}
                          alt="existing"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://placehold.co/96?text=X';
                          }}
                        />
                        {/* Badge trạng thái */}
                        <div
                          className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow ${
                            kept ? '!bg-indigo-600 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {kept ? '✓' : '✕'}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  Đang giữ{' '}
                  <span className="font-bold text-indigo-600">{keepImageIds.size}</span>/
                  {existingImages.length} ảnh cũ
                </p>
              </div>
            )}

            {/* Upload ảnh mới */}
            <p className="text-xs font-bold text-gray-500 mb-2">
              {isEdit ? 'Thêm ảnh mới:' : 'Tải ảnh lên:'}
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Preview ảnh mới đã chọn */}
              {newImages.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new-${idx}`}
                    className="w-full h-full object-cover rounded-xl border-2 border-indigo-400 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute -top-2 -right-2 !bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              ))}

              {/* Nút chọn file */}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-all text-gray-400 hover:text-indigo-500">
                <PlusOutlined style={{ fontSize: '20px' }} />
                <span className="text-[10px] font-bold mt-1 uppercase">Tải ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <p className="text-[11px] text-gray-400 mt-3">
              Chấp nhận: jpg, jpeg, png, webp · Tối đa 2MB mỗi ảnh
              {newImages.length > 0 && (
                <span className="ml-2 font-bold text-indigo-600">
                  ({newImages.length} ảnh mới đã chọn)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ========== CỘT PHẢI (1/3): Cài đặt & Submit ========== */}
        <div className="space-y-6">
          {/* ---- Cài đặt trạng thái ---- */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">
              Cài đặt
            </h2>

            {/* Trạng thái kinh doanh */}
            <div className="mb-4">
              <label className={LABEL}>Trạng thái kinh doanh</label>
              <div className="space-y-2 mt-1">
                {(['active', 'inactive'] as const).map((s) => (
                  <label
                    key={s}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      values.status === s
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={values.status === s}
                      onChange={() => handleChange('status', s)}
                      className="accent-indigo-600"
                    />
                    <span
                      className={`text-sm font-bold ${
                        values.status === s ? 'text-indigo-700' : 'text-gray-600'
                      }`}
                    >
                      {s === 'active' ? '● Đang hoạt động' : '○ Tạm ngưng kinh doanh'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hotel ID */}
            <div>
              <label className={LABEL}>Hotel ID</label>
              <input
                type="number"
                min={1}
                value={values.hotel_id}
                onChange={(e) => handleChange('hotel_id', e.target.value)}
                className={INPUT}
              />
            </div>
          </div>

          {/* ---- Preview thông tin ---- */}
          {values.name && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
              <p className="text-xs font-black text-indigo-700 uppercase tracking-wider mb-3">
                Xem trước
              </p>
              <p className="font-black text-slate-800 text-base leading-tight">{values.name}</p>
              {values.base_price && (
                <p className="text-orange-500 font-black mt-1.5">
                  {Number(values.base_price).toLocaleString('vi-VN')}{' '}
                  <span className="text-sm font-normal text-orange-400">{values.currency}</span>
                </p>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                {values.capacity && <span>👤 {values.capacity} người</span>}
                {values.area && <span>📏 {values.area} m²</span>}
                {values.bed_type && <span>🛏 {values.bed_type}</span>}
              </div>
              {amenities.length > 0 && (
                <p className="text-xs text-gray-400 mt-1.5">{amenities.length} tiện nghi</p>
              )}
            </div>
          )}

          {/* ---- Nút submit ---- */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 !bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Đang lưu...
                </span>
              ) : isEdit ? (
                'Cập nhật loại phòng'
              ) : (
                'Tạo loại phòng mới'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/roomtype')}
              disabled={submitting}
              className="w-full py-3.5 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all disabled:opacity-60"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RoomTypeForm;
