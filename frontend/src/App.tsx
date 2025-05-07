import "./color.css"
import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Campanhas from './pages/Campanhas'
import Fichas from './pages/Fichas'
import Comunidade from './pages/Comunidade'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/campanhas' element={<Campanhas/>}/>
        <Route path='/fichas' element={<Fichas/>}/>
        <Route path='/comunidade' element={<Comunidade/>}/>
      </Routes>
    </Router>
  )
}

export default App
