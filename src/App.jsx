import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ParkingProvider } from "./pages/ParkingContext";
import Interf from "./pages/interf";
import Admin from "./pages/admin";

function App() {
  return (
    <BrowserRouter>
      {/* ParkingProvider englobe tout → état partagé entre Interf et Admin */}
      <ParkingProvider>
        <Routes>
          <Route path="/" element={<Interf />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </ParkingProvider>
    </BrowserRouter>
  );
}
export default App;
