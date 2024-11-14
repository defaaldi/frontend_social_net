import { Navigate, Outlet } from "react-router-dom";
import { HeaderPub } from "./HeaderPub";
import useAuth from '../../../hooks/useAuth';

export const PublicLayout = () => {
  const { auth } = useAuth();

  // Verificación de que `auth` y `auth._id` están definidos
  const isAuthenticated = auth && auth._id;

  return (
    <>
      {/* Cabecera y Navegación Pública */}
      <HeaderPub />

      {/* Contenido Principal */}
      <section className='layout__content'>
        {!isAuthenticated ? (
          <Outlet />
        ) : (
          <Navigate to="/rsocial" />
        )}
      </section>
    </>
  );
};