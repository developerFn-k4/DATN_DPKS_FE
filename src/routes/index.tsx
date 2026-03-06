import { Route, Routes } from 'react-router-dom'
import AuthPage from '../pages/auth/pages/AuthPage'
import HomePage from '../components/Layouts/HomePage'
import RoomsListPage from '../pages/rooms/RoomsListPage'
import BookingPage from '../pages/rooms/BookingPage'

const Routers = () => {
    return (
        <Routes>
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/rooms' element={<RoomsListPage />} />
            <Route path='/booking' element={<BookingPage />} />
        </Routes>
    )
}

export default Routers