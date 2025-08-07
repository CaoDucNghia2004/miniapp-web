import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/user/Home'
import NotFound from './pages/user/NotFound'
import path from './constants/path'
import RegisterLayout from './layouts/RegisterLayout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import AboutUs from './pages/user/AboutUs'

import PrivacyPolicy from './pages/user/PrivacyPolicy'
import Services from './pages/user/Services'
import Partners from './pages/user/Partners'

const isAuthenticated = true
function ProtectedRoute() {
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectRoute() {
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <NotFound />
        </MainLayout>
      )
    },
    {
      path: path.aboutUs,
      element: (
        <MainLayout>
          <AboutUs />
        </MainLayout>
      )
    },
    {
      path: path.privacyPolicy,
      element: (
        <MainLayout>
          <PrivacyPolicy />
        </MainLayout>
      )
    },
    {
      path: path.services,
      element: (
        <MainLayout>
          <Services />
        </MainLayout>
      )
    },
    {
      path: path.partners,
      element: (
        <MainLayout>
          <Partners />
        </MainLayout>
      )
    },
    {
      path: path.login,
      element: (
        <RegisterLayout>
          <Login />
        </RegisterLayout>
      )
    },
    {
      path: path.register,
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    }
  ])
  return routeElements
}
