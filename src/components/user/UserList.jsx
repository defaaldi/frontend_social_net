import PropTypes from "prop-types";
import avatar from "../../assets/img/default.png";
import { Global } from "../../helpers/Global";
import useAuth from "../../hooks/useAuth";

export const UserList = ({
  users,
  getUsers,
  removeUsers,
  following,
  setFollowing,
  more,
  totalPages,
  setTotalPages,
  page,
  setPage,
  setCounters,
}) => {
  // Variable para almacenar el token para las peticiones a realizar en este componente
  const token = localStorage.getItem("token");

  // Se recibe la información desde el Contexto a través del hook useAuth
  const { auth } = useAuth();

  // Método para gestionar la paginación
  const nextPage = () => {
    let next = page + 1;
    setPage(next);

    // Le enviamos el número de página actual al método getUsers
    getUsers(next);
  };

  const prevPage = () => {
    if (page > 1) {
      const prev = page - 1;
      setPage(prev);
      removeUsers();
    }
  };

  // Método para seguir a un usuario
  const follow = async (userId) => {
    // Petición Ajax al Backend para seguir a un usuario
    const request = await fetch(Global.url + "follow/follow", {
      method: "POST",
      body: JSON.stringify({ followed_user: userId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    if (data.status == "success") {
      // Actualizar el estado de following, agregando al nuevo usuario seguido al array de following
      setFollowing([...following, userId]);

      // Actualizar el contador de "siguiendo" en el contexto
      setCounters((prev) => ({
        ...prev,
        followingCount: prev.followingCount + 1,
      }));
    }
  };

  // Método para dejar de seguir a un usuario
  const unfollow = async (userId) => {
    // Petición Ajax al Backend para dejar de seguir a un usuario
    const request = await fetch(Global.url + "follow/unfollow/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    // Obtener la información retornada por la request
    const data = await request.json();

    // Actualizar el estado de unfollow para eliminar el follow
    if (data.status == "success") {
      // Actualizar el estado de following, filtrando los datos para eliminar el antiguo follow (userId)
      let filterFollowings = following.filter(
        (followingUserId) => userId !== followingUserId
      );

      setFollowing(filterFollowings);

      // Actualizar el contador de "seguidores" en el contexto
      setCounters((prev) => ({
        ...prev,
        followingCount: prev.followingCount - 1,
      }));
    }
  };

  // Filtrar usuarios duplicados por _id
  const uniqueUsers = [
    ...new Map(users.map((user) => [user._id, user])).values(),
  ];

  return (
    <>
      <div className="content__posts">
        {uniqueUsers.map(
          (user) =>
            // Comprobar que user no es undefined
            user && (
              <article className="posts__post" key={user._id}>
                <div className="post__container">
                  <div className="post__image-user">
                    <div className="avatar">
                      <div className="general-info__container-avatar">
                        {user.image && user.image !== "default.png" ? (
                          <img
                            src={user.image}
                            className="container-avatar__img"
                            alt="Foto de perfil"
                          />
                        ) : (
                          <img
                            src={avatar}
                            className="container-avatar__img"
                            alt="Foto de perfil"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="post__body">
                    <div className="post__user-info">
                      <a href="#" className="user-info__name">
                        {user.name} {user.last_name}
                      </a>
                      <span className="user-info__divider"> | </span>
                      <a href="#" className="user-info__create-date">
                        {user.created_at}
                      </a>
                    </div>
                    <h4 className="post__content">{user.bio}</h4>
                  </div>
                </div>
                {/* Con esta condición, si se muestra el usuario logueado en la lista, no muestra los botones de seguir o dejar de seguir*/}
                {user._id !== auth._id && (
                  <div className="post__buttons">
                    {!following?.includes(user._id) && (
                      <button
                        className="post__button post__button--green"
                        onClick={() => follow(user._id)}
                      >
                        Seguir
                      </button>
                    )}
                    {/* Si el usuario ya está en la lista following, muestra "Dejar de Seguir" */}
                    {following?.includes(user._id) && (
                      <button
                        className="post__button"
                        onClick={() => unfollow(user._id)}
                      >
                        Dejar de Seguir
                      </button>
                    )}
                  </div>
                )}
              </article>
            )
        )}
        <br />
      </div>

      {
        // <div className="content__container-btn">
        //   <button className="content__btn-more-post" onClick={nextPage}>
        //     Ver más personas <h6>{"Pag." + " " + " " + page} </h6>
        //   </button>
        // </div>
        <div>
          <div className="content__container-btn">
            {/* Siempre muestra el botón "Anterior", incluso en la última página */}
            {page > 1 && (
              <button className="btn-pagination" onClick={prevPage}>
                Anterior
              </button>
            )}

            {/* Oculta el botón "Siguiente" cuando está en la última página */}
            {page < totalPages && (
              <button className="btn-pagination" onClick={nextPage}>
                Siguiente
              </button>
            )}
          </div>

          <div className="content__container-btn">
            Página {page} de {totalPages}
          </div>
        </div>
      }
    </>
  );
};

// Validación de props usando PropTypes
UserList.propTypes = {
  users: PropTypes.array.isRequired,
  getUsers: PropTypes.func,
  removeUsers: PropTypes.func,
  following: PropTypes.array.isRequired,
  setFollowing: PropTypes.func,
  more: PropTypes.bool.isRequired,
  totalPages: PropTypes.number.isRequired,
  setTotalPages: PropTypes.func,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func,
  setCounters: PropTypes.func,
};
