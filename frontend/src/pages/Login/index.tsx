import { Link } from 'react-router-dom';
import styles from './Login.module.css';
import seta from '../../assets/seta.svg';
import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';

  
export default function Login(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const {user, setUser} = useContext(AppContext);

  function handleSubmit() {
    fetch('http://localhost:5148/api/User/login', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then((res) =>
        res.json().then((data) => {
            if (res.ok) {
            setResponseMessage('Login realizado com sucesso!');
            setIsError(false);
            setUser(data.usuario);
            if (keepLoggedIn) {
                localStorage.setItem('user', JSON.stringify(data.usuario));
            }
            navigate("/")
            } else {
            setResponseMessage(data.message || 'Erro no login');
            setIsError(true);
            }
        })
        )
        .catch((error) => {
        setResponseMessage('Erro de conexão com o servidor.');
        console.log(error);
        setIsError(true);
        });
    }

    return(
        user ? <Navigate to="/"></Navigate> :
        <div className={styles.all}>
            <form className={styles.container} onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative', width: '100%'}}>
                    <Link to={'/'} type='button' style={{backgroundColor: 'transparent', border: 'none', cursor: 'pointer', position: 'absolute', left: 0}}><img width={30} src={seta} alt="" /></Link>
                    <h3>Login</h3>
                </div>
                <div className={styles.formDiv}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id='email' name="email" className={styles.input} value={formData.email} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}/>
                </div>
                <div className={styles.formDiv}>
                    <label htmlFor="password">Senha:</label>
                    <input type="password" id='password' name="password" className={styles.input} value={formData.password} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}/>
                </div>
                <div className={styles.formDiv}>
                    <label><input type="checkbox" name="keepLoggedIn" id="keepLoggedIn" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} /> Manter conectado</label>
                </div>
                <div className={styles.formDiv} style={{ justifyContent: 'center', marginBottom: 0, marginTop: 20}}>
                    <input type="submit" className={styles.btn}/>
                </div>
                {responseMessage && (
                    <div className={styles.formDiv} style={{ justifyContent: 'center', color: isError ? 'red' : 'green' }}>
                        <p>{responseMessage}</p>
                    </div>
                )}
                <div className={styles.formDiv}>
                    <p>Não tem uma conta? <Link to={"/registro"} style={{color: 'lightblue'}}>Registre-se</Link></p>
                </div>
            </form>
        </div>
    );
}