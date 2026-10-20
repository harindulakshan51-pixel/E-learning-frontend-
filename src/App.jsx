import AdminRoute from './components/AdminRoute';
import {Route, Routes} from 'react-router-dom'
import './App.css'
import HomePage from './pages/homepage'
import AdminPage from './pages/adminpage'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/registerPage'
import TestPage from './pages/testPage'
import ForgetPassword from './pages/forgotPasswordPage'
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useAntiInspection } from './hooks/useAntiInspection';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ;
  useAntiInspection(import.meta.env.PROD);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen w-full bg-[#FFFFFF] overflow-x-hidden">  
        <Toaster position='top-right'/>
        <Routes>
          <Route path='/*' element={<HomePage />} />
          <Route path='/admin/*' element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/test' element={<TestPage />} />
          <Route path="/forgot-password" element={<ForgetPassword/>}/>
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
