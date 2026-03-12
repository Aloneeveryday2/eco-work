import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SectionSilence from "./components/SectionSilence";
import SectionBuilding from "./components/SectionBuilding";
import SectionFlow from "./components/SectionFlow";
import SectionCalendar from "./components/SectionCalendar";
import SectionCTA from "./components/SectionCTA";
import Inscription from './pages/inscription';
import Login from './pages/Login';
import Espaces from './pages/Espaces';
import EspaceDetail from './pages/Espaces/EspaceDetail';
import UserDashboard from './pages/Dashboard/User'
import AdminDashboard from './pages/Dashboard/Admin'

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

function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) return <Navigate to="/login" />;
  if (role && user.type_de_compte !== role) return <Navigate to="/dashboard" />;

  return children;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user) {
    return user.type_de_compte === "admin"
      ? <Navigate to="/admin" />
      : <Navigate to="/dashboard" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/espaces" element={<Espaces />} />
        <Route path="/espaces/:id" element={<EspaceDetail />} />

        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/inscription" element={<PublicRoute><Inscription /></PublicRoute>} />

        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}