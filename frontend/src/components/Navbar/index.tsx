import styles from "./Navbar.module.css"
import { LogoBgEscuro } from "../../assets";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import avatar from '../../assets/avatar.svg'

export default function Navbar({selected} : {selected?: string}){
    const {user} = useContext(AppContext);
    return (
        <div className={styles.navbar}>
            <Link to="/" className={styles.linkLogo}>
                <img src={LogoBgEscuro} alt="" />
            </Link>
            <div className={styles.menu}>
                <Link to="/campanhas">
                    <button className={selected === "/campanhas" ? styles.selected : ""}>
                        Campanhas
                    </button>
                </Link>
                <Link to="/fichas">
                    <button className={selected === "/fichas" ? styles.selected : ""}>Fichas</button>
                </Link>
                <Link to="/comunidade"><button className={selected === "/comunidade" ? styles.selected : ""}>Comunidade</button></Link>
            </div>
            { user ? 
                <div className={styles.menuPerfil}>
                    <Link to="/perfil" style={{paddingRight: 15}}>
                        <img src={avatar} style={{width: 50}} alt="Perfil" />
                    </Link>
                </div> 
            :
                <div className={styles.menu}>
                    <Link to="/registro">
                        <button>Registrar</button>
                    </Link>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
            }
        </div>
    );
}