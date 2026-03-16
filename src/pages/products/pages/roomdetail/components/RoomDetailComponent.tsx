import React, { useState } from "react";
import { DatePicker, Select, Rate, Avatar, Button, Divider, Input, message } from "antd";
import type { RoomDetailResponse } from "../services/roomDetail";
import { UserOutlined, CalendarOutlined, SendOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

interface Props {
  data: RoomDetailResponse;
}

const RoomDetailView: React.FC<Props> = ({ data }) => {
  const { room, rating_summary, reviews } = data;
  const navigate = useNavigate();
  const storageUrl = "https://vietstay.ngrok.dev/storage/";
  const images = room.images ?? [];

  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Booking form state
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [guests, setGuests] = useState(2);

  const fallbackMain = "https://placehold.co/800x600/e2e8f0/64748b?text=VietStay+Room";
  const fallbackSub = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";

  const handleSubmitComment = () => {
    if (!comment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận!");
      return;
    }
    setSubmitting(true);

    console.log({
      room_id: room.id,
      rating: userRating,
      comment: comment
    });

    setTimeout(() => {
      message.success("Cảm ơn bạn đã đánh giá! Bình luận đang chờ phê duyệt.");
      setComment("");
      setUserRating(5);
      setSubmitting(false);
    }, 1500);
  };

  const handleBooking = () => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) {
      message.warning("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }

    const checkIn = dayjs(dateRange[0]).format("YYYY-MM-DD");
    const checkOut = dayjs(dateRange[1]).format("YYYY-MM-DD");

    // Navigate to booking page with state
    navigate("/booking", {
      state: {
        room_id: room.id,
        room_number: room.room_number,
        room_name: room.room_type?.name || "Phòng",
        check_in: checkIn,
        check_out: checkOut,
        guests: guests,
        price: room.price,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl overflow-hidden">

        <div className="relative mb-8 h-[300px] md:h-[450px]">
          
          <div className="absolute top-6 left-6 z-10 flex flex-col items-start pointer-events-none">
            <h2
              className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(5, 150, 105, 1)) drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.4))'
              }}
            >
              {room.room_type?.name}
            </h2>
            <h2
              className="text-2xl md:text-3xl font-bold text-white leading-none mt-1"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.9)) drop-shadow(1px 1px 3px rgba(0, 0, 0, 0.3))'
              }}
            >
              Phòng {room.room_number}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 h-full">
            <div className="col-span-2 overflow-hidden rounded-2xl">
              <img
                src={images[0] ? `${storageUrl}${images[0].image_url}` : fallbackMain}
                alt="Main"
                onError={(e) => (e.currentTarget.src = fallbackMain)}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="grid grid-rows-2 gap-3">
              {[1, 2].map((idx) => (
                <div key={idx} className="overflow-hidden rounded-2xl shadow-sm">
                  <img
                    src={images[idx] ? `${storageUrl}${images[idx].image_url}` : fallbackSub}
                    alt={`Sub ${idx}`}
                    onError={(e) => (e.currentTarget.src = fallbackSub)}
                    className="w-full h-64 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 px-2">
            
            <div className="mt-20 flex items-center gap-2 mb-6 bg-emerald-50/50 w-fit px-4 py-2 rounded-full border border-emerald-100">
              <Rate disabled allowHalf defaultValue={rating_summary?.overall || 0} className="text-emerald-500 text-sm" />
              <span className="font-bold text-emerald-700 ml-2">{rating_summary?.overall || "0.0"}</span>
              <span className="text-slate-400 text-sm">({rating_summary?.total_reviews || 0} đánh giá tổng)</span>
            </div>

            <div className="mb-10 mt-12">
              <h3 className="text-xl font-bold text-slate-800 mb-3 border-l-4 border-emerald-500 pl-3">Mô tả phòng</h3>
              <p className="text-slate-600 leading-relaxed italic">
                {room.room_type?.description || "Phòng rộng rãi với đầy đủ tiện nghi cao cấp."}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-12">
              <AmenityItem icon="📶" label="Wi-Fi miễn phí" />
              <AmenityItem icon="🍳" label="Bữa sáng miễn phí" />
              <AmenityItem icon="📺" label="Tivi màn hình phẳng" />
              <AmenityItem icon="❄️" label="Điều hòa nhiệt độ" />
              <AmenityItem icon="🍷" label="Minibar" />
              <AmenityItem icon="🌅" label="Ban công" />
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-12">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Viết đánh giá của bạn</h3>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-slate-500">Xếp hạng của bạn:</span>
                <Rate value={userRating} onChange={setUserRating} className="text-emerald-500" />
              </div>
              <TextArea
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn về căn phòng này..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 mb-4"
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={submitting}
                onClick={handleSubmitComment}
                className="bg-emerald-600 hover:bg-emerald-700 h-10 px-6 rounded-lg font-semibold"
              >
                Gửi bình luận
              </Button>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-8">Đánh giá từ khách hàng</h3>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review: any) => (
                    <div key={review.id} className="pb-6 border-b border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar icon={<UserOutlined />} className="bg-slate-200" />
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{review.user?.name || "Khách hàng"}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{dayjs(review.created_at).format('DD MMM YYYY')}</div>
                          </div>
                        </div>
                        <Rate disabled defaultValue={review.overall_score} className="text-[10px] text-emerald-500" />
                      </div>
                      <p className="text-slate-600 text-sm pl-11">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 italic">Chưa có bình luận nào.</div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 mt-44">
            <div className="sticky top-24 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-200/40">
              <h3 className="font-bold text-slate-800 mb-6 text-xl text-center">Đặt phòng ngay</h3>
              <div className="space-y-4 mb-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 px-1">Thời gian lưu trú</label>
                  <DatePicker.RangePicker
                    className="w-full h-12 rounded-xl border-slate-100 bg-slate-50"
                    placeholder={['Nhận phòng', 'Trả phòng']}
                    format="DD/MM/YYYY"
                    value={dateRange}
                    onChange={setDateRange}
                    disabledDate={(current) => {
                      return current && current < dayjs().startOf('day');
                    }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 px-1">Số lượng khách</label>
                  <Select
                    className="w-full h-12 custom-select"
                    value={guests}
                    onChange={setGuests}
                    options={[
                      { value: 1, label: '1 Người' },
                      { value: 2, label: '2 Người' },
                      { value: 3, label: '3 Người' },
                      { value: 4, label: '4 Người' },
                    ]}
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl mb-6">
                <div className="flex justify-between text-base">
                  <span className="font-bold text-slate-800">Giá phòng/đêm</span>
                  <span className="font-bold text-emerald-600">{Number(room.price).toLocaleString()} VND</span>
                </div>
                {dateRange && dateRange[0] && dateRange[1] && (
                  <div className="flex justify-between text-sm mt-2 text-slate-600">
                    <span>{dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day')} đêm</span>
                    <span>{(Number(room.price) * dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day')).toLocaleString()} VND</span>
                  </div>
                )}
              </div>

              <Button
                type="primary"
                size="large"
                className="w-full h-14 !bg-emerald-600 hover:!bg-emerald-700 !rounded-xl !border-none font-bold uppercase"
                onClick={handleBooking}
              >
                Xác nhận đặt phòng
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-select .ant-select-selector {
          background-color: #f8fafc !important;
          border-color: #f1f5f9 !important;
          border-radius: 12px !important;
          height: 48px !important;
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

const AmenityItem = ({ icon, label }: { icon: string; label: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-emerald-50">
      <span className="text-xl">{icon}</span>
    </div>
    <span className="text-slate-600 font-medium text-sm">{label}</span>
  </div>
);

export default RoomDetailView;