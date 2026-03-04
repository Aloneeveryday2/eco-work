import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SectionSilence from "./components/SectionSilence";
import SectionBuilding from "./components/SectionBuilding";
import SectionFlow from "./components/SectionFlow";
import SectionCalendar from "./components/SectionCalendar";
import SectionCTA from "./components/SectionCTA";
import Inscription from './pages/Login'
import Login from './pages/Login'

function Home() {
  return (
    <div>
      <SectionSilence />
      <SectionBuilding />
      <SectionFlow />
      <SectionCalendar />
      <SectionCTA />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}