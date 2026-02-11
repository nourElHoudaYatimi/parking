import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ParkingProvider } from "./ParkingContext";
import { useState } from "react";
import Interf from "./interf";
import Admin from "./admin";
import LoginAdmin from "./LoginAdmin";
import LoginClient from "./LoginClient";
import ReservationClient from "./ReservationClient";

export default function App() {
  const [adminAuth, setAdminAuth] = useState(false);

  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Interf />} />
          <Route path="/login-client" element={<LoginClient />} />
          <Route path="/reservation" element={<ReservationClient />} />
          <Route path="/login-admin" element={<LoginAdmin setAdminAuth={setAdminAuth} />} />
          <Route
            path="/admin"
            element={adminAuth ? <Admin setAdminAuth={setAdminAuth} /> : <Navigate to="/login-admin" replace />}
          />
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  );
}
