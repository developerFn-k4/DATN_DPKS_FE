import { Route, Routes } from 'react-router-dom';
import AuthPage from '../pages/auth/pages/AuthPage';
import HomePage from '../components/Layouts/HomePage';
import RoomDetailPage from '../pages/products/pages/roomdetail/pages/RoomDetail';
import AdminDashboard from '../admin/pages/AdminPage';
import DashboardPage from '../admin/pages/dashboard/DashboardPage';
import QuanLyRoomPage from '../admin/pages/adminroom/pages/QuanLyRoomPage';
import ReviewManagementPage from '../admin/pages/reviews/ReviewManagementPage';
import PaymentManagementPage from '../admin/pages/payments/PaymentManagementPage';
import BookingPage from '../pages/products/pages/booking-room/BookingPage';
import RoomsListPage from '../pages/products/pages/rooms/RoomsListPage';

const Routers = () => {
  return (
    <Routes>
      {/* Route cho Admin */}
      <Route path='/admin' element={<AdminDashboard />}>
        <Route index element={<DashboardPage />} />
        <Route path='qlroom' element={<QuanLyRoomPage />} />
        <Route path='reviews' element={<ReviewManagementPage />} />
        <Route path='payments' element={<PaymentManagementPage />} />
      </Route>

      {/* Route cho Client */}
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/' element={<HomePage />} />
      <Route path='/room/detail/:id' element={<RoomDetailPage />} />
      <Route path='/booking' element={<BookingPage />} />
      <Route path='/rooms' element={<RoomsListPage />} />
    </Routes>
  );
};

export default Routers;