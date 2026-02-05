
import { Route, Routes } from 'react-router-dom'
import AuthPage from '../pages/auth/pages/AuthPage'
const Routers = () => {
    return (
        <Routes>
            <Route path='/login' element={<AuthPage />} />
            
        </Routes>
    )
}

export default Routers