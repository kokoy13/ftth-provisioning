import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Dashboard/Home'
import Login from './pages/Auth/Login'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Provisioning from './pages/Dashboard/Provisioning'
import Monitoring from './pages/Dashboard/Monitoring'
import Log from './pages/Dashboard/Log'
import Credentials from './pages/Dashboard/Credentials'
import Users from './pages/Dashboard/Users'
import Profile from './pages/Dashboard/Profile'
import {AuthProvider} from './AuthContext'
import ResetPassword from './pages/Auth/ResetPassword'
import ProtectedRoute from './components/middleware/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Home /></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/provisioning",
    element: <ProtectedRoute><Provisioning /></ProtectedRoute>,
  },
  {
    path: "/monitoring",
    element: <ProtectedRoute><Monitoring /></ProtectedRoute>,
  },
  {
    path: "/logs",
    element: <ProtectedRoute><Log /></ProtectedRoute>,
  },
  {
    path: "/credentials",
    element: <ProtectedRoute><Credentials /></ProtectedRoute>,
  },
  {
    path: "/users",
    element: <ProtectedRoute><Users /></ProtectedRoute>,
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword/>,
  },
  {
    path: "/reset-password",
    element: <ResetPassword/>,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)