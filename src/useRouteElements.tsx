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
import { useContext } from 'react'
import { AppContext } from './contexts/app.context'
import UserLayout from './pages/user/User/layouts/UserLayout'
import Profile from './pages/user/User/pages/Profile'
import ChangePassword from './pages/user/User/pages/ChangePassword'
import ProjectLayout from './pages/user/Projects/layouts/ProjectLayout'
import DashboardUser from './pages/user/Projects/pages/DashboardUser'
import ProjectDetail from './pages/user/Projects/pages/ProjectDetail'
import ProjectComment from './pages/user/Projects/pages/ProjectComment'
import ProjectContract from './pages/user/Projects/pages/ProjectContract'
import ForgotPassword from './components/ForgotPassword'
import AdminLayout from './pages/admin/layouts/AdminLayout'
import AdminDashboard from './pages/admin/pages/AdminDashboard'
import AdminQuotes from './pages/admin/pages/AdminQuotes'
import CustomerManagement from './pages/admin/pages/CustomerManagement'
import ContractManagement from './pages/admin/pages/ContractManagement'
import PaymentManagement from './pages/admin/pages/PaymentManagement'
import ProjectManagement from './pages/admin/pages/ProjectManagement'
import ImplementedProjects from './pages/admin/pages/ImplementedProjects'
import TransactionHistory from './pages/admin/pages/TransactionHistory'
import AccountRequests from './pages/admin/pages/AccountRequests'
import AdminFields from './pages/admin/pages/AdminFields'

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

function AdminRoute() {
  const { isAuthenticated, profile } = useContext(AppContext)
  if (!isAuthenticated) return <Navigate to={path.login} />
  return profile?.email?.toLowerCase() === 'admin@gmail.com' ? <Outlet /> : <Navigate to={path.home} />
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
      path: path.forgotPassword,
      element: (
        <MainLayout>
          <ForgotPassword />
        </MainLayout>
      )
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            }
          ]
        }
      ]
    },

    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.project,
          element: (
            <MainLayout>
              <ProjectLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.projectDashboard,
              element: <DashboardUser />
            },
            {
              path: path.projectDetail,
              element: <ProjectDetail />
            },
            {
              path: path.projectComment,
              element: <ProjectComment />
            },
            {
              path: path.projectContract,
              element: <ProjectContract />
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <AdminRoute />,
      children: [
        {
          path: path.admin, // '/admin'
          element: <AdminLayout />, // AdminLayout có <Outlet />
          children: [
            { path: path.adminDashboard, element: <AdminDashboard /> },
            { path: '/admin/quotes', element: <AdminQuotes /> },
            { path: '/admin/customers', element: <CustomerManagement /> },
            { path: '/admin/contracts', element: <ContractManagement /> },
            { path: '/admin/payments', element: <PaymentManagement /> },
            { path: '/admin/projects', element: <ProjectManagement /> },
            { path: '/admin/implemented', element: <ImplementedProjects /> },
            { path: '/admin/history', element: <TransactionHistory /> },
            { path: '/admin/registrations', element: <AccountRequests /> },
            { path: path.adminFields, element: <AdminFields /> }
          ]
        }
      ]
    },

    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        }
      ]
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
