import styles from "./Navbar.module.css";
import { LogoBgEscuro } from "../../assets";
import { Link } from "react-router-dom";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

export default function Navbar({ selected }: { selected?: string }) {
  const { user } = useContext(AppContext);

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.linkLogo}>
        <img src={LogoBgEscuro} alt="" />
      </Link>

      <nav className={styles.menu}>
        <Link to="/campanhas">
          <button className={selected === "/campanhas" ? styles.selected : ""}>
            Campanhas
          </button>
        </Link>
        <Link to="/fichas">
          <button className={selected === "/fichas" ? styles.selected : ""}>
            Fichas
          </button>
        </Link>
        <Link to="/comunidade">
          <button className={selected === "/comunidade" ? styles.selected : ""}>
            Comunidade
          </button>
        </Link>
      </nav>

      {user === null ? (
        <div style={{ width: 120 }}></div>
      ) : user ? (
        <div className={styles.menuPerfil}>
          <Link
            to={"/" + user.username + "/perfil"}
            style={{ paddingRight: 15 }}
          >
            <img src={avatar} style={{ width: 50 }} alt="Perfil" />
          </Link>
        </div>
      ) : (
        <div className={styles.menu}>
          <Link to="/registro">
            <button>Registrar</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
    </header>
  );
}
