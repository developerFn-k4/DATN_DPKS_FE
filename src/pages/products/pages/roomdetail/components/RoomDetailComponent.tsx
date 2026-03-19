import React, { useState, useEffect, useMemo } from "react";
import { DatePicker, Rate, Avatar, Button, Input, message, Card, Popconfirm, Space } from "antd";
import { UserOutlined, SendOutlined, EditOutlined, DeleteOutlined, CloseOutlined, CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useRoomDetail } from "../hooks/RoomHook";
import type { Review } from "../../../services/roomDetail";
import { Link, useNavigate } from "react-router-dom";

const { TextArea } = Input;

interface Props {
  roomId: number;
}

const RoomDetailView: React.FC<Props> = ({ roomId }) => {
  const { room, ratingSummary, reviews, submitting, submitReview, editReview, removeReview } = useRoomDetail(roomId);

  const storageUrl = "https://vietstay.ngrok.dev/storage/";
  const images = room?.images ?? [];

  const [userRating, setUserRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState<string>("");
  const [editRating, setEditRating] = useState<number>(5);
  const navigate = useNavigate();

  const handleGoToBooking = () => {
    if (!room) return;

    if (!dates || !dates[0] || !dates[1]) {
      message.warning("Vui lòng chọn ngày nhận và trả phòng!");
      return;
    }

  navigate("/booking", {
    state: {
      room_id: room.id,
      room_number: room.room_number,
      room_name: room.room_type.name,
      check_in: dates[0].format("YYYY-MM-DD"),
      check_out: dates[1].format("YYYY-MM-DD"),
      guests: 1, 
      price: room.price
    }
  });
};
  const nightCount = useMemo(() => {
    if (dates && dates[0] && dates[1]) {
      const diff = dates[1].diff(dates[0], "day");
      return diff > 0 ? diff : 0;
    }
    return 1;
  }, [dates]);

 const totalPrice = useMemo(() => {
  const basePrice = room?.price || 0;
  return basePrice * nightCount;
}, [room?.price, nightCount]);

 useEffect(() => {
  if (reviews) {
    setLocalReviews(reviews);
  }
}, [reviews.length]);

  const fallbackMain = "https://placehold.co/800x600/e2e8f0/64748b?text=VietStay+Room";
  const fallbackSub = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";


const handleSubmitComment = async () => {
  if (!comment.trim()) {
    message.warning("Vui lòng nhập nội dung bình luận!");
    return;
  }
  if (!room) return;

  const ratingValue = userRating;
  const commentValue = comment;

  const newReview: Review = {
    id: Date.now(),
    room_id: room.id,
    user_id: 1,      
    booking_id: 5,   
    cleanliness: ratingValue,
    comfort: ratingValue,
    location: ratingValue,
    service: ratingValue,
    value: ratingValue,
    wifi: ratingValue,
    overall_score: ratingValue,
    comment: commentValue,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: { id: 1, name: "Bạn", avatar: null },
  };

  setLocalReviews((prev) => [newReview, ...prev]);
  setComment("");
  setUserRating(5);

  try {
    await submitReview({
      user_id: 1,     
      booking_id: 5,   
      cleanliness: ratingValue,
      comfort: ratingValue,
      location: ratingValue,
      service: ratingValue,
      value: ratingValue,
      wifi: ratingValue,
      comment: commentValue,
    });
    message.success("Cảm ơn bạn đã đánh giá!");
  } catch (err) {
    message.error("Gửi bình luận thất bại!");
    setLocalReviews((prev) => prev.filter((r) => r.id !== newReview.id));
  }
};

  const handleUpdateReview = async (id: number) => {
  if (!editComment.trim()) return message.warning("Nội dung không được để trống!");
  
  const currentReview = localReviews.find(r => r.id === id);
  if (!currentReview) return;

  try {
    await editReview(id, {
      user_id: currentReview.user_id,   
      booking_id: currentReview.booking_id, 
      cleanliness: editRating,
      comfort: editRating,
      location: editRating,
      service: editRating,
      value: editRating,
      wifi: editRating,
      comment: editComment,
    });

    setLocalReviews((prev) =>
      prev.map((r) =>
        r.id === id 
          ? { ...r, comment: editComment, overall_score: editRating } 
          : r
      )
    );

    message.success("Cập nhật thành công!");
    setEditingId(null);
  } catch {
    message.error("Lỗi cập nhật!");
  }
};
  const handleDeleteReview = async (id: number) => {
    try {
      await removeReview(id);
      message.success("Đã xóa bình luận!");
    } catch {
      message.error("Lỗi khi xóa!");
    }
  };

  if (!room) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-white min-h-screen">
      <div className="relative mb-10 h-[500px] md:h-[650px] w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-3 gap-2 h-full">
          <div className="col-span-2 h-full">
            <img
              src={images[0] ? `${storageUrl}${images[0].image_url}` : fallbackMain}
              alt="Main"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.currentTarget.src = fallbackMain)}
            />
          </div>
          <div className="grid grid-rows-2 gap-2 h-full">
            {[1, 2].map((idx) => (
              <div key={idx} className="h-full overflow-hidden">
                <img
                  src={images[idx] ? `${storageUrl}${images[idx].image_url}` : fallbackSub}
                  alt={`Sub ${idx}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => (e.currentTarget.src = fallbackSub)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">
              {room.room_type.name} - {room.room_number}
            </h1>
            <h2 className="text-lg text-gray-500 mb-4">{room.room_type.description}</h2>
            <div className="flex items-center gap-3">
              <Rate disabled allowHalf value={ratingSummary?.reviews_avg_overall_score || 0} />
              <span className="font-bold text-emerald-600">
                {ratingSummary?.reviews_avg_overall_score?.toFixed(1) || "0.0"}
              </span>
              <span className="text-gray-400">({ratingSummary?.reviews_count || 0} đánh giá)</span>
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          <div className="bg-gray-50 p-6 rounded-2xl mb-10 border border-gray-100">
            <h3 className="font-bold mb-4 text-lg">Viết đánh giá của bạn</h3>
            <Rate value={userRating} onChange={setUserRating} className="mb-4 text-emerald-500 block" />
            <TextArea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm..."
              className="mb-4 rounded-xl border-gray-200"
            />
            <Button
              type="primary"
              size="large"
              icon={<SendOutlined />}
              loading={submitting}
              onClick={handleSubmitComment}
              className="bg-emerald-600 hover:bg-emerald-700 border-none rounded-lg px-8"
            >
              Gửi đánh giá
            </Button>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6">Đánh giá từ khách hàng</h3>
            {localReviews.length > 0 ? (
              localReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-50 py-6 last:border-0 group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Avatar size={48} icon={<UserOutlined />} className="bg-gray-200" />
                      <div>
                        <div className="font-semibold text-base">{review.user?.name}</div>
                        <div className="text-xs text-gray-400">{dayjs(review.created_at).format("DD/MM/YYYY")}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Space>
                        <Button 
                          type="text" 
                          size="small" 
                          className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          icon={<EditOutlined />} 
                          onClick={() => {
                            setEditingId(review.id);
                            setEditComment(review.comment);
                            setEditRating(review.overall_score);
                          }}
                        />
                        <Popconfirm title="Xóa đánh giá này?" onConfirm={() => handleDeleteReview(review.id)} okText="Xóa" cancelText="Hủy">
                          <Button 
                            type="text" 
                            size="small" 
                            danger 
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            icon={<DeleteOutlined />} 
                          />
                        </Popconfirm>
                      </Space>
                      {editingId !== review.id && (
                        <Rate disabled value={review.overall_score} className="text-emerald-500 text-sm" />
                      )}
                    </div>
                  </div>

                  {editingId === review.id ? (
                    <div className="mt-4 p-4 bg-white border border-blue-100 rounded-xl shadow-sm">
                      <Rate value={editRating} onChange={setEditRating} className="mb-2 block text-sm" />
                      <TextArea 
                        value={editComment} 
                        onChange={(e) => setEditComment(e.target.value)} 
                        rows={3} 
                        className="mb-3 rounded-lg" 
                      />
                      <Space>
                        <Button type="primary" size="small" icon={<CheckOutlined />} onClick={() => handleUpdateReview(review.id)} loading={submitting}>Lưu</Button>
                        <Button size="small" icon={<CloseOutlined />} onClick={() => setEditingId(null)}>Hủy</Button>
                      </Space>
                    </div>
                  ) : (
                    <p className="ml-12 text-gray-600 mt-3 leading-relaxed">{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic py-4">Chưa có bình luận nào.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card className="shadow-xl border-gray-100 rounded-2xl overflow-hidden">
              <div className="mb-4">
                <span className="text-2xl font-bold text-emerald-600">
                  {new Intl.NumberFormat("vi-VN").format(room.price || 0)}đ
                </span>
                <span className="text-gray-500"> / đêm</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ngày nhận & trả phòng</label>
                  <DatePicker.RangePicker
                    className="w-full h-12 rounded-lg"
                    placeholder={["Nhận phòng", "Trả phòng"]}
                    disabledDate={(current) => current && current < dayjs().startOf("day")}
                    onChange={(values) => setDates(values as any)}
                  />
                </div>

              

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleGoToBooking}
                  className="h-14 text-lg font-bold !bg-emerald-600 hover:!bg-emerald-700 border-none rounded-xl mt-4 flex items-center justify-center"
                >
                  Đặt phòng ({nightCount} đêm)
                </Button>
                <p className="text-center text-gray-400 text-sm mt-4">Bạn vẫn chưa bị trừ tiền</p>
              </div>

              <hr className="my-6 border-gray-100" />

              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>
                    {new Intl.NumberFormat("vi-VN").format(room.price || 0)}đ x {nightCount} đêm
                  </span>
                  <span>{new Intl.NumberFormat("vi-VN").format(totalPrice)}đ</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                  <span>Tổng cộng</span>
                  <span className="text-emerald-700">{new Intl.NumberFormat("vi-VN").format(totalPrice)}đ</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailView;