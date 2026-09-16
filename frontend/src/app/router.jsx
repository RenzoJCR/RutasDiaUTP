import { createBrowserRouter } from 'react-router-dom'

import AppShell from '../components/layout/AppShell'
import HomePage from '../modules/home/pages/HomePage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
])