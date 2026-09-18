import {
  createBrowserRouter,
} from 'react-router-dom'

import AppShell from '../components/layout/AppShell'
import ProtectedRoute from '../components/routing/ProtectedRoute'
import RoleRoute from '../components/routing/RoleRoute'

import HomePage from '../modules/home/pages/HomePage'

import AuthLayout from '../modules/auth/components/AuthLayout'
import LoginPage from '../modules/auth/pages/LoginPage'
import RegisterPage from '../modules/auth/pages/RegisterPage'

import MentorManagementPage from '../modules/admin/users/pages/MentorManagementPage'
import AdminManagementPage from '../modules/admin/users/pages/AdminManagementPage'

export const router =
  createBrowserRouter([

    {
      element: <AuthLayout />,

      children: [

        {
          path: '/login',
          element: <LoginPage />,
        },

        {
          path: '/registro',
          element: <RegisterPage />,
        },

      ],
    },

    {
      element: <ProtectedRoute />,

      children: [

        {
          element: <AppShell />,

          children: [

            {
              path: '/',
              element: <HomePage />,
            },

            {
              element: (
                <RoleRoute
                  allowedRoles={[
                    'ADMINISTRADOR',
                  ]}
                />
              ),

              children: [

                {
                  path: '/admin/mentores',
                  element: (
                    <MentorManagementPage />
                  ),
                },

                {
                  path: '/admin/administradores',
                  element: (
                    <AdminManagementPage />
                  ),
                },

              ],
            },

          ],
        },

      ],
    },

  ])