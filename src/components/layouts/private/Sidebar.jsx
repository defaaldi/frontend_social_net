import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import avatar from "../../../assets/img/default.png";
import { Global } from "../../../helpers/Global";
import useAuth from "../../../hooks/useAuth";
import { useForm } from "../../../hooks/useForm";

export const Sidebar = () => {
  const { auth, counters, setCounters } = useAuth();
  const { form, changed } = useForm({});
  const [stored, setStored] = useState("not_stored");
  const navigate = useNavigate();

  // useEffect para ocultar el mensaje de éxito después de 1 segundo
  useEffect(() => {
    if (stored === "stored") {
      const timer = setTimeout(() => {
        setStored("not_stored"); // Aquí se cambia el estado a "not_stored" para ocultar el mensaje
      }, 1000);

      // Limpiar el temporizador si el componente se desmonta antes de que se complete
      return () => clearTimeout(timer);
    }
  }, [stored]); // Este efecto solo se ejecuta cuando "stored" cambia

  const savePublication = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Recoger datos del formulario
    let newPublication = form;
    newPublication.user = auth._id;

    // Hacer request para guardar en bd
    const request = await fetch(Global.url + "publication/new-publication", {
      method: "POST",
      body: JSON.stringify(newPublication),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await request.json();

    // Mostrar mensaje de exito o error
    if (data.status == "success") {
      setStored("stored");

      // Actualizar el contador de publicaciones después de crear la publicación
      setCounters((prevCounters) => ({
        ...prevCounters,
        publicationsCount: prevCounters.publicationsCount + 1, // Incrementa en 1
      }));

      // Redirigir a la página de Mis Publicaciones y recargar las publicaciones
      navigate("/rsocial/mis-publicaciones", {
        state: { newPublication: true },
      });
    } else {
      setStored("error");
    }

    // Subir imagen
    const fileInput = document.querySelector("#file");

    if (data.status == "success" && fileInput.files[0]) {
      const formData = new FormData();
      formData.append("file0", fileInput.files[0]);

      const uploadRequest = await fetch(
        Global.url + "publication/upload-media/" + data.publicationStored._id,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: token,
          },
        }
      );

      const uploadData = await uploadRequest.json();

      if (uploadData.status !== "success") {
        setStored("error");
      }
    }

    // Resetear el formulario
    const myForm = document.querySelector("#publication-form");
    myForm.reset();
  };

  return (
    <aside className="layout__aside">
      <header className="aside__header">
        <h1 className="aside__title">Hola, {auth.name} </h1>
      </header>

      <div className="aside__container">
        <div className="aside__profile-info">
          <div className="profile-info__general-info">
            <div className="general-info__container-avatar">
              {auth.image != "default.png" && (
                <img
                  src={auth.image}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
              {auth.image == "default.png" && (
                <img
                  src={avatar}
                  className="container-avatar__img"
                  alt="Foto de perfil"
                />
              )}
            </div>

            <div className="general-info__container-names">
              <Link
                to={"/rsocial/perfil/" + auth._id}
                className="container-names__name"
              >
                {auth.name} {auth.last_name}
              </Link>
              <p className="container-names__nickname"> {auth.nick}</p>
            </div>
          </div>

          <div className="profile-info__stats">
            <div className="stats__following">
              <Link
                to={"/rsocial/siguiendo/" + auth._id}
                className="following__link"
              >
                <span className="following__title">Siguiendo</span>
                <span className="following__number">
                  {" "}
                  {counters.followingCount}{" "}
                </span>
              </Link>
            </div>
            <div className="stats__following">
              <Link
                to={"/rsocial/seguidores/" + auth._id}
                className="following__link"
              >
                <span className="following__title">Seguidores</span>
                <span className="following__number">
                  {" "}
                  {counters.followedCount}{" "}
                </span>
              </Link>
            </div>

            <div className="stats__following">
              <Link
                to={"/rsocial/mis-publicaciones/"}
                className="following__link"
              >
                <span className="following__title">Publicaciones</span>
                <span className="following__number">
                  {" "}
                  {counters.publicationsCount}{" "}
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="aside__container-form">
          {stored == "stored" && (
            <strong className="alert alert-success">
              {" "}
              ¡¡Publicada correctamente!!
            </strong>
          )}

          {stored == "error" && (
            <strong className="alert alert-danger">
              {" "}
              ¡¡No se ha publicado nada!!
            </strong>
          )}

          <form
            id="publication-form"
            className="container-form__form-post"
            autoComplete="off"
            onSubmit={savePublication}
          >
            <div className="form-post__inputs">
              <label className="form-post__label">
                ¿Qué quieres compartir hoy?
              </label>
              <textarea
                id="text"
                name="text"
                className="form-post__textarea"
                onChange={changed}
              />
            </div>

            <div className="form-post__inputs">
              <label className="form-post__label">
                Sube una imagen y dinos algo de ella...
              </label>

              {/* INPUT Para seleccionar imagen de pergil AVATAR desde */}
              <input
                className="file-input"
                type="file"
                name="file0"
                id="file"
                autoComplete="file"
              />
              <label for="file" className="center_load_avatar file-input">
                Cargar Image
              </label>
            </div>

            <button type="submit" className="mi-btn-Button">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
};
