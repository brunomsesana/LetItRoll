import { Navbar } from "../../components";
import styles from "./Campanhas.module.css"


export default function Campanhas(){
    return(
        <>
            <Navbar selected="/campanhas"/>
            <main className={styles.main}>
                <section>
                    <h1>Campanhas</h1>
                    <div className={styles.window}>
                        <div style={{textAlign: "center"}}>
                            <p>Nenhuma campanha encontrada!</p>
                            <button>Criar Campanha</button>
                        </div>
                    </div>
                </section>
                <section>
                    <h1>Sistemas</h1>
                    <div className={styles.window}>
                        <div style={{textAlign: "center"}}>
                            <p>Nenhum sistema encontrado!</p>
                            <button>Criar Sistema</button>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}