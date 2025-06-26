import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import About from "./pages/About.jsx"
import Profile from "./pages/Profile.jsx"
import CCAHome from "./pages/CCAHome.jsx"
import Archery from "./pages/Archery.jsx"
import MatchmakingForm from "./pages/MatchmakingForm.jsx"
import AvailableMatches from './pages/AvailableMatches.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cca-home" element={<CCAHome />}/>
          <Route path="/archery" element={<Archery />}/>
          <Route path="/matchmaking-form" element={<MatchmakingForm />} />
          <Route path="/available-matches" element={<AvailableMatches />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
