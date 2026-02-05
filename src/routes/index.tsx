
import { Route, Routes } from 'react-router-dom'
import AuthPage from '../pages/auth/pages/AuthPage'
import HomePage from '../components/Layouts/HomePage'
const Routers = () => {
    return (
        <Routes>
            <Route path='/login' element={<AuthPage />} />
            <Route path='/' element={<HomePage />} />

        </Routes>
    )
}

export default Routers