import { Navbar } from "../../components";
import styles from './Home.module.css'

export default function Home(){
    return(
        <>
            <Navbar></Navbar>
            <main className={styles.main}>
                <section>
                    <div style={{width: "40%"}}>
                        <h1>Todos os seus mundos em um só lugar!</h1>
                        <button>Jogue Agora!</button>
                    </div>
                    <aside className={styles.imgDiv}>
                        <img src="/home/computerDice_home.svg" style={{width: "100%", margin: 0}} alt="" />
                    </aside>
                </section>
                <section style={{flexDirection: "row-reverse"}}>
                    <div style={{width: "40%"}}>
                        <h1>Aqui, quem manda é você!</h1>
                        <ul>
                            <li><p>Crie seus personagens usando fichas de sistemas pré-programados ou programe uma você mesmo.</p></li>
                            <li><p>Organize sua história de maneira simples, conectando mundos e personagens facilmente.</p></li>
                            <li><p>Divirta-se com seus amigos em uma mesa compartilhada!</p></li>
                        </ul>
                    </div>
                    <aside className={styles.imgDiv} style={{marginLeft: 0, marginRight: 100}}>
                        <img src="/home/folder_home.svg" style={{width: "100%", margin: 0}} alt="" />
                    </aside>
                </section>
            </main>
        </>
    );
}