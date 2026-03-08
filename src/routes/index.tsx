import { Route, Routes } from 'react-router-dom'
import AuthPage from '../pages/auth/pages/AuthPage'
import HomePage from '../components/Layouts/HomePage'
import RoomDetailPage from '../pages/products/pages/roomdetail/pages/RoomDetail'
import AdminDashboard from '../admin/pages/AdminPage'
import QuanLyRoomPage from '../admin/pages/adminroom/pages/quanLyRoomPage'
const Routers = () => {
    return (
        <Routes>
            <Route path='/admin' element={<AdminDashboard />} >
             <Route path='qlroom' element={<QuanLyRoomPage />} />

            </Route>



            <Route path='/auth' element={<AuthPage />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/room/detail/:id' element={<RoomDetailPage />} />
        </Routes>
    )
}

export default Routers