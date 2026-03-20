import { Route, Routes } from 'react-router-dom';
import AuthPage from '../pages/auth/pages/AuthPage';
import HomePage from '../components/Layouts/HomePage';
import RoomDetailPage from '../pages/products/pages/roomdetail/pages/RoomDetail';
import AdminDashboard from '../admin/pages/AdminPage';
import BookingPage from '../pages/products/pages/booking-room/BookingPage';
import CheckoutPage from '../pages/products/pages/checkout/CheckoutPage';
import RoomsListPage from '../pages/products/pages/rooms/RoomsListPage';
import AdminUserPage from '../admin/pages/adminuser/pages/AdminUserPage';
import QuanLyRoomPage from '../admin/pages/adminroom/pages/quanLyRoomPage';
import DashboardPage from '../admin/pages/dashboard/DashboardPage';
import ReviewManagementPage from '../admin/pages/review/ReviewManagementPage';
import PaymentManagementPage from '../admin/pages/payments/PaymentManagementPage';
import PaymentReturnPage from '../pages/products/pages/paymentcomfirm/pages/PaymentReturnPage';

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
        {/* Bạn có thể thêm các route con khác như ql-loai-phong ở đây */}
      </Route>

      {/* Route cho Client */}
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/room/detail/:id' element={<RoomDetailPage />} />
      <Route path='/booking' element={<BookingPage />} />
      <Route path='/checkout' element={<CheckoutPage />} />
      <Route path='/rooms' element={<RoomsListPage />} />
      <Route path='/payment-return' element={<PaymentReturnPage />} />
    </Routes>
  );
};

export default Routers;