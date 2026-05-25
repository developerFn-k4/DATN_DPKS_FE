import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserOutlined, SendOutlined, LockOutlined } from "@ant-design/icons";
import { Avatar, Progress, Rate, Input, Spin, message, Select } from "antd";
import type { RoomTypeL } from "../../../services/roomTypeService";
import { reviewService, type ReviewComment, type RatingSummary, type PostReviewPayload } from "../../../../../services/review/reviewService";

const { TextArea } = Input;

interface Props {
  room: RoomTypeL & {
    total_reviews?: number;
    average_rate?: number;
    extra_adult_price?: string;
  };
  onClose?: () => void;
}

const RATING_LABELS: { key: keyof Omit<RatingSummary, "total_reviews">; label: string }[] = [
  { key: "cleanliness", label: "Vệ sinh" },
  { key: "comfort", label: "Tiện nghi" },
  { key: "location", label: "Vị trí" },
  { key: "service", label: "Dịch vụ" },
  { key: "value", label: "Giá trị" },
  { key: "wifi", label: "WiFi" },
];

const emptyScores = (): Omit<PostReviewPayload, "booking_id" | "comment"> => ({
  cleanliness: 5,
  comfort: 5,
  location: 5,
  service: 5,
  value: 5,
  wifi: 5,
});

export const RoomDetailComponent: React.FC<Props> = ({ room, onClose }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- booking / room config state ---
  const availableRooms = room.available_rooms || 0;
  const maxAdultsPerRoom = room.max_adults || 2;
  const maxChildrenPerRoom = room.max_children || 0;
  const capacity = Number(room.capacity) || 2;
  const extraAdultPrice = Number(room.extra_adult_price) || 200000;

  const staticServices = [
    { id: 1, name: "Ăn sáng", price: 100000 },
    { id: 2, name: "Đưa đón sân bay", price: 300000 },
    { id: 3, name: "Giặt ủi", price: 50000 },
    { id: 4, name: "Spa & Massage", price: 400000 },
    { id: 5, name: "Giường phụ", price: 200000 },
    { id: 6, name: "Thuê xe máy", price: 150000 },
    { id: 7, name: "Thuê xe ô tô", price: 800000 },
    { id: 8, name: "Dọn phòng", price: 50000 },
  ];
  const apiServices = room.services?.map((s) => ({ id: s.id || s.service_id, name: s.name, price: Number(s.price) })) || [];
  const allServices = [...staticServices, ...apiServices];

  const [checkIn, setCheckIn] = useState("2026-04-10");
  const [checkOut, setCheckOut] = useState("2026-04-12");
  const [roomCount, setRoomCount] = useState(availableRooms > 0 ? 1 : 0);
  const [rooms, setRooms] = useState([{ adults: 1, children: 0, infant: 0 }]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // --- review state ---
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewHasMore, setReviewHasMore] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [eligibilityReason, setEligibilityReason] = useState<string | null>(null);
  const [eligibleBookings, setEligibleBookings] = useState<{ id: number; check_out: string }[]>([]);
  const [loadingEligibility, setLoadingEligibility] = useState(false);

  // form state
  const [scores, setScores] = useState(emptyScores());
  const [comment, setComment] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const roomTypeId = room.room_type_id;

  // Fetch reviews + summary
  useEffect(() => {
    if (!roomTypeId) return;
    const fetch = async () => {
      setLoadingReviews(true);
      try {
        const res = await reviewService.getReviews(roomTypeId, 1);
        setSummary(res.summary ?? null);
        setComments(res.data ?? []);
        setReviewPage(1);
        setReviewHasMore((res.meta?.current_page ?? 1) < (res.meta?.last_page ?? 1));
      } catch {
        // silently fail — show empty state
      } finally {
        setLoadingReviews(false);
      }
    };
    fetch();
  }, [roomTypeId]);

  // Fetch eligibility when user is logged in
  useEffect(() => {
    if (!token || !roomTypeId) return;
    const fetch = async () => {
      setLoadingEligibility(true);
      try {
        const res = await reviewService.getEligibility(roomTypeId);
        setCanReview(res.can_review ?? false);
        setEligibilityReason(res.reason ?? null);
        setEligibleBookings(res.eligible_bookings ?? []);
        if (res.eligible_bookings && res.eligible_bookings.length > 0) {
          setSelectedBookingId(res.eligible_bookings[0].id);
        }
      } catch {
        setCanReview(false);
      } finally {
        setLoadingEligibility(false);
      }
    };
    fetch();
  }, [token, roomTypeId]);

  const loadMoreReviews = async () => {
    const nextPage = reviewPage + 1;
    setLoadingReviews(true);
    try {
      const res = await reviewService.getReviews(roomTypeId, nextPage);
      setComments((prev) => [...prev, ...(res.data ?? [])]);
      setReviewPage(nextPage);
      setReviewHasMore(nextPage < (res.meta?.last_page ?? 1));
    } catch {
      // ignore
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedBookingId) {
      message.error("Vui lòng chọn đơn đặt phòng để đánh giá.");
      return;
    }
    if (!comment.trim()) {
      message.error("Vui lòng nhập nhận xét.");
      return;
    }
    try {
      setSubmitting(true);
      await reviewService.postReview({ booking_id: selectedBookingId, comment, ...scores });
      message.success("Cảm ơn bạn đã đánh giá!");
      setComment("");
      setScores(emptyScores());
      // Refresh reviews
      const res = await reviewService.getReviews(roomTypeId, 1);
      setSummary(res.summary ?? null);
      setComments(res.data ?? []);
      setReviewPage(1);
      setReviewHasMore((res.meta?.current_page ?? 1) < (res.meta?.last_page ?? 1));
      // Refresh eligibility (booking may now be used)
      const elig = await reviewService.getEligibility(roomTypeId);
      setCanReview(elig.can_review ?? false);
      setEligibilityReason(elig.reason ?? null);
      setEligibleBookings(elig.eligible_bookings ?? []);
    } catch (err: any) {
      message.error(err?.response?.data?.message || err.message || "Gửi đánh giá thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  // ------- pricing helpers -------
  const calculateNights = () => {
    const diff = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  };
  const nights = calculateNights();
  const formatPrice = (p: number) => new Intl.NumberFormat("vi-VN").format(p);
  const basePrice = Number(room.base_price) || 0;

  const handleRoomChange = (value: number) => {
    setRoomCount(value);
    setRooms(Array.from({ length: value }, () => ({ adults: 1, children: 0, infant: 0 })));
  };
  const toggleService = (id: number) =>
    setSelectedServices((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const extraChargeTotal = rooms.reduce((acc, r) => {
    const overshoot = r.adults + r.children - capacity;
    return acc + (overshoot > 0 ? overshoot * extraAdultPrice : 0);
  }, 0) * nights;
  const serviceTotal = selectedServices.reduce((total, id) => {
    const s = allServices.find((s) => s.id === id);
    return total + (s?.price || 0) * roomCount * nights;
  }, 0);
  const total = basePrice * roomCount * nights + serviceTotal + extraChargeTotal;

  const handleBooking = () => {
    const bookingData = {
      roomId: room.room_type_id,
      roomName: room.name,
      checkIn, checkOut, nights, roomCount,
      guestConfig: rooms,
      selectedServices: allServices.filter((s) => selectedServices.includes(s.id)),
      totalPrice: total,
    };
    navigate("/booking", { state: bookingData });
    if (onClose) onClose();
  };

  // ------- rating display helpers -------
  const displaySummary = summary ?? (room.rating_summary ?? null);
  const overallRating = displaySummary?.overall ?? room.average_rating ?? room.average_rate ?? 0;
  const totalReviewsCount = displaySummary?.total_reviews ?? room.total_reviews ?? 0;

  return (
    <div className="bg-white w-full max-w-6xl mx-auto relative shadow-xl rounded-lg overflow-hidden border">
      {onClose && (
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-black text-2xl z-50">✕</button>
      )}

      <div className="p-6 md:p-10">
        <h2 className="text-4xl font-black mb-6">{room.name}</h2>

        {/* GALLERY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {room.images?.map((img, index) => (
            <img key={index} src={img} className="w-full h-40 object-cover rounded-sm" alt="room" />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* TIỆN NGHI */}
            <div>
              <h4 className="font-bold text-xl mb-3 text-gray-800">Trang thiết bị & Tiện ích</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                {room.amenities?.map((a, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✔</span> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* RATING SUMMARY below amenities */}
            {(overallRating > 0 || totalReviewsCount > 0) && (
              <div className="flex flex-wrap gap-3 items-center py-3 border-y border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-yellow-400 text-white font-black rounded-lg text-lg">
                    ★ {Number(overallRating).toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">{totalReviewsCount} đánh giá</span>
                </div>
                {displaySummary && RATING_LABELS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    <span className="font-semibold">{label}:</span>
                    <span className="text-yellow-500 font-bold">{Number(displaySummary[key] ?? 0).toFixed(1)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CHỌN PHÒNG */}
            <div className="border rounded overflow-hidden shadow-sm">
              <div className="bg-gray-100 p-3 flex justify-between items-center">
                <span className="font-bold text-gray-700">{roomCount} / {availableRooms} Phòng còn trống</span>
                <select title="Số phòng" value={roomCount} onChange={(e) => handleRoomChange(Number(e.target.value))} className="border px-3 py-1 rounded outline-none bg-white">
                  {Array.from({ length: availableRooms + 1 }, (_, i) => <option key={i} value={i}>{i} Phòng</option>)}
                </select>
              </div>
              {rooms.map((r, index) => (
                <div key={index} className="p-4 border-t bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold text-green-700 uppercase tracking-wider italic border-l-4 border-green-600 pl-2">Cấu hình Phòng {index + 1}</p>
                    <span className="text-xs font-medium text-gray-500">Sức chứa: {r.adults + r.children} / {capacity}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Người lớn</label>
                      <select title="Số người lớn" value={r.adults} onChange={(e) => { const n = [...rooms]; n[index].adults = Number(e.target.value); setRooms(n); }} className="w-full border rounded p-1.5 outline-none">
                        {Array.from({ length: maxAdultsPerRoom }, (_, i) => {
                          const num = i + 1;
                          return <option key={num} value={num} disabled={(num + r.children) > capacity + 1}>{num}{(num + r.children) > capacity ? " (Vượt mức)" : ""}</option>;
                        })}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Trẻ em</label>
                      <select title="Số trẻ em" value={r.children} onChange={(e) => { const n = [...rooms]; n[index].children = Number(e.target.value); setRooms(n); }} className="w-full border rounded p-1.5 outline-none">
                        {Array.from({ length: maxChildrenPerRoom + 1 }, (_, i) => (
                          <option key={i} value={i} disabled={(i + r.adults) > capacity + 1}>{i}{(i + r.adults) > capacity ? " (Vượt mức)" : ""}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Em bé</label>
                      <select title="Số em bé" value={r.infant} onChange={(e) => { const n = [...rooms]; n[index].infant = Number(e.target.value); setRooms(n); }} className="w-full border rounded p-1.5 outline-none">
                        {[0, 1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ĐÁNH GIÁ & COMMENT */}
            <div className="pt-8 border-t border-gray-100">
              <h4 className="font-bold text-xl mb-6 text-gray-800">Xếp hạng và đánh giá</h4>

              {/* Summary bar chart */}
              {displaySummary ? (
                <div className="flex flex-col md:flex-row gap-10 items-center mb-8">
                  <div className="text-center">
                    <div className="text-6xl font-black text-gray-800">{Number(overallRating).toFixed(1)}</div>
                    <Rate disabled value={overallRating} allowHalf className="text-xs text-yellow-500 my-2" />
                    <div className="text-xs text-gray-400">{totalReviewsCount} nhận xét</div>
                  </div>
                  <div className="flex-1 space-y-1.5 w-full">
                    {RATING_LABELS.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-3 text-xs font-bold text-gray-500">
                        <span className="w-14 text-right">{label}</span>
                        <Progress percent={(displaySummary[key] ?? 0) * 20} showInfo={false} strokeColor="#059669" trailColor="#f3f4f6" size="small" />
                        <span className="w-6 text-gray-700">{Number(displaySummary[key] ?? 0).toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                overallRating > 0 && (
                  <div className="flex flex-col md:flex-row gap-10 items-center mb-8">
                    <div className="text-center">
                      <div className="text-6xl font-black text-gray-800">{Number(overallRating).toFixed(1)}</div>
                      <Rate disabled value={overallRating} allowHalf className="text-xs text-yellow-500 my-2" />
                      <div className="text-xs text-gray-400">{totalReviewsCount} nhận xét</div>
                    </div>
                  </div>
                )
              )}

              {/* Comments list */}
              <div className="space-y-4 mb-6">
                {loadingReviews && comments.length === 0 ? (
                  <div className="flex justify-center py-6"><Spin /></div>
                ) : comments.length > 0 ? (
                  <>
                    {comments.map((review) => (
                      <div key={review.id} className="bg-white p-4 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar icon={<UserOutlined />} src={review.user?.avatar ?? undefined} className="bg-gray-200 text-gray-600" />
                          <div>
                            <div className="font-semibold text-gray-800">{review.user?.name ?? "Ẩn danh"}</div>
                            <Rate disabled value={review.overall_score} allowHalf className="text-xs" />
                          </div>
                          <div className="ml-auto text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString("vi-VN")}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {RATING_LABELS.map(({ key, label }) => (
                            <span key={key} className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                              {label}: {review[key as keyof ReviewComment] as number}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {reviewHasMore && (
                      <button
                        type="button"
                        onClick={loadMoreReviews}
                        disabled={loadingReviews}
                        className="w-full py-2 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                      >
                        {loadingReviews ? "Đang tải..." : "Xem thêm đánh giá"}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-400 py-4">Chưa có đánh giá nào.</div>
                )}
              </div>

              {/* Review form */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h5 className="font-bold text-gray-700 mb-4">Viết đánh giá của bạn</h5>

                {!token ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <LockOutlined />
                    <span>Bạn cần <a href="/auth" className="text-green-600 underline">đăng nhập</a> để viết đánh giá.</span>
                  </div>
                ) : loadingEligibility ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400"><Spin size="small" /> Đang kiểm tra...</div>
                ) : !canReview ? (
                  <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <LockOutlined className="mt-0.5" />
                    <span>{eligibilityReason ?? "Bạn cần đã hoàn thành lưu trú và thanh toán đầy đủ để viết đánh giá."}</span>
                  </div>
                ) : (
                  <>
                    {eligibleBookings.length > 1 && (
                      <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">Chọn đơn đặt phòng để đánh giá</label>
                        <Select
                          value={selectedBookingId ?? undefined}
                          onChange={(v) => setSelectedBookingId(v)}
                          options={eligibleBookings.map((b) => ({ value: b.id, label: `Đơn #${b.id} (trả phòng ${b.check_out})` }))}
                          className="w-full"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {RATING_LABELS.map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-16">{label}</span>
                          <Rate
                            value={scores[key as keyof typeof scores]}
                            onChange={(v) => setScores((prev) => ({ ...prev, [key]: v }))}
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar icon={<UserOutlined />} className="bg-white text-gray-400 mt-1" />
                      <TextArea
                        rows={3}
                        placeholder="Viết nhận xét của bạn về phòng này..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="rounded-xl border-none shadow-sm flex-1"
                        disabled={submitting}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSubmitReview}
                        disabled={submitting}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {submitting ? <Spin size="small" /> : <SendOutlined />} Gửi đánh giá
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 h-fit sticky top-6">
            <div className="text-center pb-2 border-b border-gray-200">
              <span className="text-3xl font-black text-[#b18a5d]">{formatPrice(basePrice)}</span>
              <span className="text-gray-400 text-sm ml-1 uppercase"> VND / đêm</span>
            </div>

            <div className="space-y-3">
              <input type="date" title="Ngày nhận phòng" aria-label="Ngày nhận phòng" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
              <input type="date" title="Ngày trả phòng" aria-label="Ngày trả phòng" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border px-3 py-2 rounded-lg" />
              <div className="bg-blue-50 py-1.5 rounded-lg text-center text-blue-600 font-bold text-[11px]">Thời gian: {nights} Đêm</div>
            </div>

            <div>
              <p className="font-bold text-gray-700 text-sm mb-3">Dịch vụ bổ sung</p>
              <div className="space-y-1 max-h-60 overflow-y-auto text-sm pr-2">
                {allServices.map((s) => (
                  <label key={s.id} className="flex justify-between items-center py-2 px-1 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-white transition-colors rounded">
                    <span className="flex items-center text-gray-600">
                      <input type="checkbox" checked={selectedServices.includes(s.id)} onChange={() => toggleService(s.id)} className="mr-3 w-4 h-4 accent-green-600 rounded" />
                      {s.name}
                    </span>
                    <span className="text-gray-400 font-medium text-[11px]">{formatPrice(s.price)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-dashed pt-4 text-sm space-y-2.5">
              <div className="flex justify-between text-gray-500">
                <span>Tiền phòng:</span>
                <span className="font-bold text-gray-800">{formatPrice(basePrice * roomCount * nights)}</span>
              </div>
              {extraChargeTotal > 0 && (
                <div className="flex justify-between text-orange-600 italic">
                  <span>Phụ thu vượt người:</span>
                  <span className="font-bold">+{formatPrice(extraChargeTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-500">
                <span>Phí dịch vụ:</span>
                <span className="font-bold text-gray-800">{formatPrice(serviceTotal)}</span>
              </div>
              <div className="flex justify-between items-center font-black text-[#b18a5d] text-2xl border-t-2 border-gray-200 mt-4 pt-4">
                <span className="text-sm text-gray-800 uppercase">Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBooking}
              disabled={availableRooms === 0 || roomCount === 0}
              className="w-full py-4 rounded-xl font-bold !bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {availableRooms === 0 ? "Hết phòng" : "Đặt phòng ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
