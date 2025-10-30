import "./color.css";
import "./App.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Campanhas from "./pages/Campanhas";
import Fichas from "./pages/Fichas";
import Comunidade from "./pages/Comunidade";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import CriarSistema from "./pages/CriarSistema";
import { useContext, useEffect } from "react";
import { AppContext } from "./contexts/AppContext";

function App() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (user == null) {
      console.log("Verificando status do usuário...");
      fetch("http://localhost:5148/api/User/refresh", {
        method: "POST",
        credentials: "include",
      }).then((res) => {
        if (res.status == 401) {
          console.log("Refresh falhou (401).");
          const isPublicPage =
            location.pathname === "/" ||
            location.pathname === "/login" ||
            location.pathname === "/registro";
            if (!isPublicPage) {
              console.log("Redirecionando para /login");
              navigate("/login");
            }
        } else if (res.ok) {
          res.json().then((data) => {
            console.log("Refresh bem-sucedido:", data);
            setUser(data.user);
          });
        } else {
          console.error("Erro no refresh:", res.status);
        }
      })
      .catch(err => {
        // Erro de rede ou fetch
        console.error("Fetch falhou:", err);
         const isPublicPage =
           location.pathname === "/" ||
           location.pathname === "/login" ||
           location.pathname === "/registro";
         if (!isPublicPage) {
           navigate("/login");
         }
      });
    }
  }, [navigate, setUser, user, location]);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/campanhas" element={<Campanhas />} />
      <Route path="/fichas" element={<Fichas />} />
      <Route path="/comunidade" element={<Comunidade />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/:username/perfil" element={<Perfil />} />
      <Route path="/criar-sistema" element={<CriarSistema />} />
    </Routes>
  );
}

export default App;
