import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ParkingProvider } from "./pages/ParkingContext";
import { useState } from "react";

import Interf from "./pages/Interf";
import Admin from "./pages/Admin";
import LoginAdmin from "./pages/LoginAdmin";
import LoginClient from "./pages/LoginClient";
import ReservationClient from "./pages/ReservationClient";

export default function App() {
  const [adminAuth, setAdminAuth] = useState(false);

  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Interf />} />
          <Route path="/login-client" element={<LoginClient />} />
          <Route path="/reservation" element={<ReservationClient />} />
          <Route
            path="/login-admin"
            element={<LoginAdmin setAdminAuth={setAdminAuth} />}
          />
          <Route
            path="/admin"
            element={
              adminAuth
                ? <Admin setAdminAuth={setAdminAuth} />
                : <Navigate to="/login-admin" replace />
            }
          />
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  );
}
