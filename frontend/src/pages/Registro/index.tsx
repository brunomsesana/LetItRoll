import { useContext, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import styles from './Registro.module.css';
import seta from '../../assets/seta.svg';
import { AppContext } from '../../contexts/AppContext';

export default function Registro() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const {user, setUser} = useContext(AppContext);
  const navigate = useNavigate();

  function handleSubmit() {
  fetch('http://localhost:5148/api/User/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
    credentials: "include"
  })
    .then((res) =>
      res.json().then((data) => {
        console.log(data);

        if (res.ok) {
          setResponseMessage('Registro realizado com sucesso!');
          setIsError(false);
          setUser(data.usuario);
          if (keepLoggedIn) {
            localStorage.setItem('user', JSON.stringify(data.usuario));
          }
        } else {
          setResponseMessage(data.message || 'Erro no registro');
          setIsError(true);
        }
      })
    )
    .then(() => {navigate("/")})
    .catch((error) => {
      console.error(error);
      setResponseMessage('Erro de conexão com o servidor.');
      setIsError(true);
    });
}


  return (
    user ? <Navigate to="/"></Navigate> :
    <div className={styles.all}>
      <form className={styles.container} onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative', width: '100%'}}>
          <Link to={'/'} type='button' style={{backgroundColor: 'transparent', border: 'none', cursor: 'pointer', position: 'absolute', left: 0}}>
            <img width={30} src={seta} alt="" />
          </Link>
          <h3>Registro</h3>
        </div>
        <div className={styles.formDiv}>
          <label htmlFor="name">Nome:</label>
          <input type="text" id='name' name='name' className={styles.input} value={formData.name} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
        </div>
        <div className={styles.formDiv}>
          <label htmlFor="lastName">Sobrenome:</label>
          <input type="text" id='lastName' name='lastName' className={styles.input} value={formData.lastName} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
        </div>
        <div className={styles.formDiv}>
          <label htmlFor="email">Email:</label>
          <input type="email" id='email' name='email' className={styles.input} value={formData.email} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
        </div>
        <div className={styles.formDiv}>
          <label htmlFor="password">Senha:</label>
          <input type="password" id='password' name='password' className={styles.input} value={formData.password} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
        </div>
        <div className={styles.formDiv}>
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input type="password" id='confirmPassword' name='confirmPassword' className={styles.input} value={formData.confirmPassword} onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} />
        </div>
        <div className={styles.formDiv}>
                    <label><input type="checkbox" name="keepLoggedIn" id="keepLoggedIn" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} /> Manter conectado</label>
                </div>
        <div className={styles.formDiv} style={{ justifyContent: 'center', marginBottom: 0, marginTop: 20 }}>
          <input type="submit" className={styles.btn} value="Registrar" />
        </div>
        {responseMessage && (
          <div className={styles.formDiv} style={{ justifyContent: 'center', color: isError ? 'red' : 'green' }}>
            <p>{responseMessage}</p>
          </div>
        )}
        <div className={styles.formDiv} style={{ justifyContent: 'center' }}>
          <p>Já tem uma conta? Faça o <Link to={"/login"} style={{ color: 'lightblue' }}>Login</Link></p>
        </div>
      </form>
    </div>
  );
}
