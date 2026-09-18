import {
  Navigate,
  Outlet,
} from 'react-router-dom'

import { useAuth } from '../../modules/auth/hooks/useAuth'

function RoleRoute({
  allowedRoles,
}) {

  const { user } = useAuth()

  if (
    !user
    || !allowedRoles.includes(
      user.role,
    )
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return <Outlet />
}

export default RoleRoute