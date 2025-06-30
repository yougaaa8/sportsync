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
import Archery from "./components/CCADetailLayout.jsx"
import MatchmakingForm from "./pages/MatchmakingForm.jsx"
import AvailableMatches from './pages/AvailableMatches.jsx'
import EventList from "./pages/EventList.jsx"
import EventForm from "./pages/EventForm.jsx"
import FacilityList from './pages/FacilityList.jsx'
import CCADetailPage from './pages/CCADetailPage.jsx'
import CCADashboardPage from './pages/CCADashboardPage.jsx'
import CCAMemberManagementLayout from './pages/CCAMemberManagementLayout.jsx'
import CCATrainingSessionManagement from "./pages/CCATrainingSessionManagement.jsx"
import { Container } from "@mui/material"
import { ThemeProvider } from '@mui/material/styles';
import theme from "../theme.jsx";
import MatchDetailLayout from './components/MatchDetailLayout.jsx'
import EventDetailPage from './pages/EventDetailPage.jsx'
import MerchandiseShop from './pages/MerchandiseShop.jsx'
import TournamentPage from './pages/TournamentPage.jsx'
import TournamentSportsPage from './pages/TournamentSportsPage.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Container>
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
              <Route path="/event-list" element={<EventList />} />
              <Route path="/event-form" element={<EventForm />} />
              <Route path="/facility-list" element={<FacilityList />} />
              <Route path="/cca-detail/:ccaId" element={<CCADetailPage />} />
              <Route path="/cca-dashboard/:ccaId" element={<CCADashboardPage />} />
              <Route path="/cca-member-management/:ccaId" element={<CCAMemberManagementLayout />} />
              <Route path="/cca-training-management/:ccaId" element={<CCATrainingSessionManagement />} />
              <Route path="/match-detail/:lobbyId" element={<MatchDetailLayout />} />  
              <Route path="/event-detail/:eventId" element={<EventDetailPage />} />
              <Route path="/merchandise-shop" element={<MerchandiseShop />} />
              <Route path="/tournament" element={<TournamentPage />} /> 
              <Route path="/tournament-sports/:tournamentId" element={<TournamentSportsPage />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
