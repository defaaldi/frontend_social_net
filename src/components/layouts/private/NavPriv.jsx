import { NavLink } from "react-router-dom";
import avatar from "../../../assets/img/default.png";
import useAuth from "../../../hooks/useAuth";

export const NavPriv = () => {
  // Usamos el hook Auth para tener disponible el objeto del usuario identificado.
  const { auth } = useAuth();

  return (
    <nav className="navbar__container-lists">
      <ul className="container-lists__menu-list">
        <li className="menu-list__item">
          <NavLink to="/rsocial" className="menu-list__link">
            <i className="fa-solid fa-house"></i>
            <span className="menu-list__title">Inicio</span>
          </NavLink>
        </li>

        <li className="menu-list__item">
          <NavLink to="/rsocial/feed" className="menu-list__link">
            <i className="fa-solid fa-list"></i>
            <span className="menu-list__title">Timeline</span>
          </NavLink>
        </li>

        <li className="menu-list__item">
          <NavLink to="/rsocial/gente" className="menu-list__link">
            <i className="fa-solid fa-users"></i>
            <span className="menu-list__title">Gente</span>
          </NavLink>
        </li>
      </ul>

      <ul className="container-lists__list-end">
        <li className="list-end__item">
          <div className="img-avatar-nav">
            {auth.image != "default.png" && (
              <img
                src={auth.image}
                className="container-avatar__img-nav"
                alt="Foto de perfil"
              />
            )}
            {auth.image == "default.png" && (
              <img
                src={avatar}
                className="container-avatar__img-nav"
                alt="Foto de perfil"
              />
            )}
          </div>
        </li>
        <li className="list-end__item">
          <a href="#" className="list-end__link">
            <span className="list-end__name">{auth.nick}</span>
          </a>
        </li>
        <li className="list-end__item">
          <NavLink to="/rsocial/ajustes" className="list-end__link">
            <i className="fa-solid fa-gear"></i>
            <span className="list-end__name">Ajustes</span>
          </NavLink>
        </li>
        <li className="list-end__item">
          <NavLink to="/rsocial/logout" className="list-end__link">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="list-end__name">Cerrar sesión</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
