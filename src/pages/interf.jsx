import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParking } from "./ParkingContext";
import "./interf.css";

function Interf() {
  const navigate = useNavigate();
  const { places, reservations } = useParking();

  const [selectedPlace, setSelectedPlace] = useState(null);

  const totalPlaces = 200;
  const numbers = Array.from({ length: totalPlaces }, (_, i) => i + 1);
  const occupiedCount = Object.values(places).filter((v) => v !== null).length;
  const reservedCount = Object.values(places).filter((v) => v !== null && v.reserved).length;
  const freeCount = totalPlaces - occupiedCount;
  const pendingCount = reservations.filter((r) => r.status === "pending").length;

  const rows = [];
  for (let i = 0; i < numbers.length; i += 20) {
    rows.push(numbers.slice(i, i + 20));
  }

  const handlePlaceClick = (num) => {
    if (places[num] !== null) {
      setSelectedPlace(selectedPlace === num ? null : num);
    }
  };

  return (
    <div className="app-wrapper" onClick={() => setSelectedPlace(null)}>

      {/* ─── HEADER ─── */}
      <header className="park-header">
        <div className="header-inner">
          <div className="logo-block">
            <div className="logo-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="2.5"/>
                <path d="M4 18h40" stroke="currentColor" strokeWidth="2"/>
                <rect x="10" y="22" width="8" height="12" rx="2" fill="currentColor" opacity="0.8"/>
                <rect x="22" y="22" width="8" height="12" rx="2" fill="currentColor" opacity="0.8"/>
                <rect x="34" y="22" width="8" height="12" rx="2" fill="currentColor" opacity="0.8"/>
                <path d="M18 10V6M30 10V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="brand-name">ParkSys</span>
              <span className="brand-sub">Smart Parking — v2.6</span>
            </div>
          </div>

          <div className="header-divider" aria-hidden="true" />

          <div className="header-stats">
            <div className="stat-pill">
              <span className="stat-label">Total</span>
              <span className="stat-value">{totalPlaces}</span>
            </div>
            <div className="stat-pill free">
              <span className="stat-label">Libres</span>
              <span className="stat-value">{freeCount}</span>
            </div>
            <div className="stat-pill occupied">
              <span className="stat-label">Occupés</span>
              <span className="stat-value">{occupiedCount}</span>
            </div>
            {reservedCount > 0 && (
              <div className="stat-pill reserved">
                <span className="stat-label">Réservés</span>
                <span className="stat-value">{reservedCount}</span>
              </div>
            )}
          </div>

          {/* Bouton Réserver */}
          <button className="reserve-button" onClick={(e) => { e.stopPropagation(); navigate("/login-client"); }}>
            Réserver une place
            {pendingCount > 0 && <span className="pending-badge">{pendingCount}</span>}
          </button>

          <button className="admin-button" onClick={(e) => { e.stopPropagation(); navigate("/login-admin"); }}>
            <span className="btn-icon">⚙</span>
            Admin
          </button>
        </div>

        <div className="occupancy-bar">
          <div
            className="occupancy-fill"
            style={{ width: `${(occupiedCount / totalPlaces) * 100}%` }}
          />
        </div>
      </header>

      {/* ─── MAIN ─── */}
      <main className="park-main">
        <div className="section-label">
          <span className="label-line" />
          <span>Plan du Parking — Niveau 0</span>
          <span className="label-line" />
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-swatch libre" /> Libre
          </div>
          <div className="legend-item">
            <span className="legend-swatch occupied" /> Occupé
          </div>
          <div className="legend-item">
            <span className="legend-swatch reserved-swatch" /> Réservé
          </div>
        </div>

        <div className="parking-lot">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="parking-row">
              <span className="row-index">R{rowIndex + 1}</span>
              <div className="row-places">
                {row.map((placeNumber) => {
                  const info = places[placeNumber];
                  const isOccupied = info !== null;
                  const isReserved = info !== null && info.reserved === true;
                  const isSelected = selectedPlace === placeNumber;

                  return (
                    <div
                      key={placeNumber}
                      className={`parking-place ${isOccupied ? "occupied" : ""} ${isReserved ? "reserved" : ""} ${isSelected ? "selected" : ""}`}
                      onClick={(e) => { e.stopPropagation(); handlePlaceClick(placeNumber); }}
                      title={isOccupied ? `Place ${placeNumber} — ${info.matricule}` : `Place ${placeNumber} — Libre`}
                    >
                      <span className="place-number">{placeNumber}</span>

                      <svg className="car-icon" viewBox="0 0 40 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 15H33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M5 15L8 8C8.8 6.2 10.5 5 12.5 5H27.5C29.5 5 31.2 6.2 32 8L35 15V18C35 18.6 34.6 19 34 19H6C5.4 19 5 18.6 5 18V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                        <path d="M10 8.5H30L28 13H12L10 8.5Z" fill="currentColor" opacity="0.15"/>
                        <circle cx="12" cy="19" r="3" fill="currentColor" opacity="0.9"/>
                        <circle cx="12" cy="19" r="1.5" fill="var(--place-bg)"/>
                        <circle cx="28" cy="19" r="3" fill="currentColor" opacity="0.9"/>
                        <circle cx="28" cy="19" r="1.5" fill="var(--place-bg)"/>
                        <path d="M5 13H8M32 13H35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>

                      <span className="place-status-dot" />

                      {/* Popup matricule au clic */}
                      {isSelected && isOccupied && (
                        <div className="place-popup" onClick={(e) => e.stopPropagation()}>
                          <div className="popup-arrow" />
                          {isReserved && <span className="popup-reserved-tag">⭐ Réservé</span>}
                          <span className="popup-label">Matricule</span>
                          <span className="popup-matricule">{info.matricule}</span>
                          {info.client?.nom && (
                            <span className="popup-time">👤 {info.client.nom}</span>
                          )}
                          {info.heureEntree && (
                            <span className="popup-time">⬇ {info.heureEntree}</span>
                          )}
                          {info.heureSortie && (
                            <span className="popup-time">⬆ {info.heureSortie}</span>
                          )}
                          {info.montant && (
                            <span className="popup-montant">{info.montant} DT</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="park-footer">
        <span>© 2026 ParkSys Intelligence</span>
        <span className="footer-sep">◆</span>
        <span>Système de gestion de parking professionnel</span>
        <span className="footer-sep">◆</span>
        <span className="footer-status">
          <span className="status-dot" /> Système opérationnel
        </span>
      </footer>
    </div>
  );
}

export default Interf;
