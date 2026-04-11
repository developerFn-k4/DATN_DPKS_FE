import { Route, Routes } from 'react-router-dom';
import AuthPage from '../pages/auth/pages/AuthPage';
import HomePage from '../components/Layouts/HomePage';
import RoomDetailPage from '../pages/products/pages/roomdetail/pages/RoomDetail';
import AdminDashboard from '../admin/pages/AdminPage';
import BookingPage from '../pages/products/pages/booking-room/BookingPage';
import CheckoutPage from '../pages/products/pages/checkout/CheckoutPage';
import AdminUserPage from '../admin/pages/adminuser/pages/AdminUserPage';
import QuanLyRoomPage from '../admin/pages/adminroom/pages/quanLyRoomPage';
import DashboardPage from '../admin/pages/dashboard/DashboardPage';
import ReviewManagementPage from '../admin/pages/review/ReviewManagementPage';
import PaymentManagementPage from '../admin/pages/payments/PaymentManagementPage';
import PaymentReturnPage from '../pages/products/pages/paymentcomfirm/pages/PaymentReturnPage';
import DashboardAdmin from '../admin/pages/adminroom/pages/DashboardAdmin';
import Statistics from '../pages/admin/Statistics';
import BookingManagement from '../pages/admin/BookingManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import RoomList from '../pages/admin/RoomList';
import ServiceList from '../pages/admin/ServiceList';
import QuanLyRoomTypePage from '../admin/pages/adminroomtype/pages/RoomTypePage';
import RoomTypeDetail from '../admin/pages/adminroomtype/pages/RoomTypeDetail';
import RoomTypeForm from '../admin/pages/adminroomtype/pages/RoomTypeForm';
// ---- Trang chi tiết admin (5 module) ----
import BookingDetail from '../pages/admin/BookingDetail';
import PaymentDetail from '../pages/admin/PaymentDetail';
import AdminRoomDetailPage from '../pages/admin/RoomDetail';
import ServiceDetail from '../pages/admin/ServiceDetail';
import AdminRoomTypeDetail from '../pages/admin/RoomTypeDetail';
import RoomTypePage from '../pages/products/pages/roomtype/pages/RoomTypePage';
import ProfilePage from '../pages/auth/pages/user/pages/UserPages';

const Routers = () => {
  return (
    <Routes>
      {/* Route cho Admin */}
      <Route path='/admin' element={<AdminDashboard />}>
        <Route index element={<DashboardPage />} />
        <Route path='qlroom' element={<QuanLyRoomPage />} />
        <Route path='reviews' element={<ReviewManagementPage />} />
        <Route path='qluser' element={<AdminUserPage />} />
        <Route path='payments' element={<PaymentManagementPage />} />
        <Route path='roomtype' element={<QuanLyRoomTypePage />} />
        {/* /new phải đứng TRƯỚC /:id để không bị parse thành id="new" */}
        <Route path='roomtype/new' element={<RoomTypeForm />} />
        <Route path='roomtype/:id' element={<RoomTypeDetail />} />
        <Route path='roomtype/:id/edit' element={<RoomTypeForm />} />
        {/* Chi tiết booking */}
        <Route path='bookings/:id' element={<BookingDetail />} />
        {/* Chi tiết payment (lấy theo bookingId) */}
        <Route path='payments/:bookingId' element={<PaymentDetail />} />
        {/* Chi tiết phòng */}
        <Route path='rooms/:id' element={<AdminRoomDetailPage />} />
        {/* Chi tiết dịch vụ */}
        <Route path='services/:id' element={<ServiceDetail />} />
        {/* Chi tiết loại phòng (view-only từ adminApi) */}
        <Route path='room-types/:id' element={<AdminRoomTypeDetail />} />
        <Route path='bookings' element={<BookingManagement />} />
        <Route path='orders' element={<OrderManagement />} />
        <Route path='tai-san' element={<RoomList />} />
        <Route path='dich-vu' element={<ServiceList />} />
        <Route path='thong-ke' element={<Statistics />} />
        {/* Bạn có thể thêm các route con khác như ql-loai-phong ở đây */}
      </Route>

      {/* Route cho Client */}
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/user' element={<ProfilePage />} />
      <Route path='/room/:id' element={<RoomDetailPage />} />
      <Route path='/booking' element={<BookingPage />} />
      <Route path='/checkout' element={<CheckoutPage />} />
      <Route path='/rooms' element={<RoomTypePage />} />
      <Route path='/payment-return' element={<PaymentReturnPage />} />
      <Route path='/bookinguser' element={<BookingPage />} />
    </Routes>
  );
};

export default Routers;