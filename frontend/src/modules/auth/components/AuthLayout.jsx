import { Outlet } from 'react-router-dom'

function AuthLayout() {

  return (
    <div className="auth-layout">

      <div className="auth-panel">

        <div className="auth-brand">

          <div className="auth-brand-mark">
            UTP
          </div>

          <div>
            <div className="fw-bold">
              Rutas Día UTP
            </div>

            <div className="text-secondary small">
              UTP Lima Norte
            </div>
          </div>

        </div>

        <Outlet />

      </div>

    </div>
  )
}

export default AuthLayout