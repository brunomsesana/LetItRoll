import "./color.css"
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Campanhas from './pages/Campanhas'
import Fichas from './pages/Fichas'
import Comunidade from './pages/Comunidade'
import Registro from "./pages/Registro"
import Login from "./pages/Login"
import Perfil from "./pages/Perfil"
import CriarFicha from "./pages/CriarFicha"

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/campanhas' element={<Campanhas/>}/>
        <Route path='/fichas' element={<Fichas/>}/>
        <Route path='/comunidade' element={<Comunidade/>}/>
        <Route path="/registro" element={<Registro/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/perfil" element={<Perfil/>}/>
        <Route path="/criar-ficha" element={<CriarFicha/>}/>
      </Routes>
    </Router>
  )
}

export default App
