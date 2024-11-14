import image from "../../assets/img/image_error404.svg";
import { Link } from "react-router-dom";
import "../../assets/css/error404.css";

export const Error404 = () => {
  return (
    <div className="container">
      <div className="content">
        <img src={image} className="image" alt="404 Error" />
        <div className="text-content">
          <h1 className="title">Algo no salió bien...</h1>
          <p className="text">
            La página que intenta abrir no existe. Puede que haya escrito mal la
            dirección o que la página se haya movido a otra URL. Si cree que se
            trata de un error, póngase en contacto con servicio técnico al
            correo support@gmail.com
          </p>
          {/* Utiliza Link para enlazar al inicio */}
          <Link to="/" className="button">
            Volver a la página de inicio
          </Link>
        </div>
      </div>
    </div>
  );
};
