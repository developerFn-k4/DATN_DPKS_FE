import { Route, Routes } from 'react-router-dom'
import AuthPage from '../pages/auth/pages/AuthPage'
import HomePage from '../components/Layouts/HomePage'
import BookingPage from '../pages/products/pages/booking-room/BookingPage'
const Routers = () => {
    return (
        <Routes>
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/' element={<HomePage />} />
            <Route path='/booking' element={<BookingPage />} />
        </Routes>
    )
}

export default Routers