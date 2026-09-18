import { Link, Outlet } from "react-router-dom";

import { useAuth } from "../../modules/auth/hooks/useAuth";

function AppShell() {
  const { user, logout } = useAuth();

  const isAdmin = user?.role === "ADMINISTRADOR";

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center gap-4">
              <Link to="/" className="app-brand text-decoration-none">
                Rutas Día UTP
              </Link>

              {isAdmin && (
                <nav className="d-none d-md-flex gap-3">
                  <Link to="/admin/mentores" className="app-nav-link">
                    Mentores
                  </Link>

                  <Link to="/admin/administradores" className="app-nav-link">
                    Administradores
                  </Link>
                </nav>
              )}
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-end d-none d-sm-block">
                <div className="small fw-semibold">{user?.fullName}</div>

                <div className="text-secondary app-user-role">
                  {isAdmin ? "Administrador" : "Mentor"}
                </div>
              </div>

              <Link
                to="/mi-cuenta/contrasena"
                className="btn btn-sm btn-outline-dark"
              >
                Cambiar contraseña
              </Link>

              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={logout}
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-fluid px-4 py-4">
        <Outlet />
      </main>
    </div>
  );
}

export default AppShell;
