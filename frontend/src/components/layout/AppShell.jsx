import { Outlet } from 'react-router-dom'

function AppShell() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between py-3">
            <span className="app-brand">
              Rutas Día UTP
            </span>

            <span className="text-secondary small">
              UTP Lima Norte
            </span>
          </div>
        </div>
      </header>

      <main className="container-fluid px-4 py-4">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell