import styles from "./Navbar.module.css"
import { LogoBgEscuro } from "../../assets";
import { Link } from "react-router-dom";

export default function Navbar({selected} : {selected?: string}){
    return (
        <div className={styles.navbar}>
            <img src={LogoBgEscuro} alt="" />
            <div className={styles.menu}>
                <Link to="/campanhas">
                    <button className={selected === "/campanhas" ? styles.selected : ""}>
                        Campanhas
                    </button>
                </Link>
                <Link to="/fichas"><button className={selected === "/fichas" ? styles.selected : ""}>Fichas</button></Link>
                <Link to="/comunidade"><button className={selected === "/comunidade" ? styles.selected : ""}>Comunidade</button></Link>
            </div>
            <div className={styles.menu}>
                <button>Registrar</button>
                <button>Login</button>
            </div>
        </div>
    );
}