import { useState } from "react";
import { Global } from "../../helpers/Global";
import { useForm } from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  // Estado para obtener los datos desde el formulario
  const { form, changed, resetForm } = useForm({ email: "", password: "" });

  // Estado para validar si el usuario se identificó correctamente
  const [logged, setLogged] = useState("not logged");

  // Estado para setear los valores del token y usuario en el contexto de la aplicación
  const { setAuth } = useAuth();

  const loginUser = async (e) => {
    // prevenir que se actualice el navegador
    e.preventDefault();

    // Obtener los datos del formulario
    let userToLogin = form;

    // Petición al backend
    const request = await fetch(Global.url + "user/login", {
      method: "POST",
      body: JSON.stringify(userToLogin),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    if (data.status == "success") {
      // Guardar los datos del token y usuario en el localstorage del navegador
      localStorage.setItem("token", data.token);
      // Asegurarse de almacenar el usuario en formato JSON
      localStorage.setItem("user", JSON.stringify(data.userBD));

      // Seteamos la variable de estado logged si se autenticó correctamente el usuario
      setLogged("logged");

      // Seteamos los datos del usuario en el Auth
      setAuth(data.userBD);

      // Limpiar el formulario
      resetForm();

      // Redirección
      navigate("/rsocial");

      // Forzar una recarga
      window.location.reload();
    } else {
      // Seteamos la variable de estado logged si no se autenticó el usuario
      setLogged("error");
    }
  };

  return (
    <>
      <div className="login">
        <div className="loginWrapper">
          <div className="loginLeft ">
            <h3 className="loginLogo">B-270</h3>
            <span className="logoDesc">
              Conecta con amigos del Bootcamp 270
            </span>
          </div>

          <div className="loginRight">
            <div className="form-container">
              <div className="div-container">
                {/* Mensajes para el usuario */}
                {logged == "logged" ? (
                  <strong className="alert alert-success">
                    ¡Usuario autenticado correctamente!
                  </strong>
                ) : (
                  ""
                )}
                {logged == "error" ? (
                  <strong className="alert alert-danger">
                    ¡El usuario no se ha autenticado!
                  </strong>
                ) : (
                  ""
                )}
                <form onSubmit={loginUser} className="form-container">
                  <div className="titleForm">
                    {/* Titulo del Formulario */}
                    <header>
                      <h1>Login</h1>
                    </header>
                  </div>
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    className="form-container"
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={changed}
                    autoComplete="username"
                  />

                  <label htmlFor="password">Contraseña</label>
                  <input
                    className="form-container"
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={form.password}
                    onChange={changed}
                    autoComplete="current-password"
                  />

                  <button
                    type="submit"
                    className="mi-btn-Button"
                    to="/registro"
                  >
                    Identifícate
                  </button>
                </form>
                <NavLink to="/registro">
                  <div className="goRegister">Registrate</div>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
