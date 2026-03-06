import { Route, Routes } from 'react-router-dom'
import AuthPage from '../pages/auth/pages/AuthPage'
import HomePage from '../components/Layouts/HomePage'
import RoomDetailPage from '../pages/products/pages/roomdetail/pages/RoomDetail'
const Routers = () => {
    return (
        <Routes>
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/room/detail/:id' element={<RoomDetailPage />} />
        </Routes>
    )
}

export default Routers