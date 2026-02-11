import { createContext, useContext, useState } from "react";

export const ParkingContext = createContext();

export function ParkingProvider({ children }) {
  const [places, setPlaces] = useState(() => {
    const obj = {};
    for (let i = 1; i <= 200; i++) obj[i] = null;
    return obj;
  });

  // Demandes de réservation en attente
  const [reservations, setReservations] = useState([]);

  const occuperPlace = (num, data) => {
    setPlaces((prev) => ({ ...prev, [num]: data }));
  };

  const libererPlace = (num) => {
    setPlaces((prev) => ({ ...prev, [num]: null }));
  };

  const mettreAJourSortie = (num, heureSortie, montant, heures) => {
    setPlaces((prev) => ({
      ...prev,
      [num]: prev[num] ? { ...prev[num], heureSortie, montant, heures } : null,
    }));
  };

  // Soumettre une demande de réservation client
  const soumettreReservation = (data) => {
    const newRes = {
      id: Date.now(),
      ...data,
      status: "pending", // pending | accepted | rejected
      soumisLe: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };
    setReservations((prev) => [...prev, newRes]);
    return newRes.id;
  };

  // Admin accepte une réservation → occupe la place
  const accepterReservation = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r))
    );
    const res = reservations.find((r) => r.id === id);
    if (res) {
      const TARIF = 5;
      let montant = null, heures = null;
      if (res.heureEntree && res.heureSortie) {
        const [hE, mE] = res.heureEntree.split(":").map(Number);
        const [hS, mS] = res.heureSortie.split(":").map(Number);
        const totalMin = hS * 60 + mS - (hE * 60 + mE);
        if (totalMin > 0) {
          heures = (totalMin / 60).toFixed(2);
          montant = (heures * TARIF).toFixed(2);
        }
      }
      // Trouver la 1ère place libre si pas spécifiée, ou utiliser place 1-200
      const placeNum = res.placeNum || findFreePlace();
      if (placeNum) {
        occuperPlace(placeNum, {
          matricule: res.matricule,
          heureEntree: res.heureEntree,
          heureSortie: res.heureSortie || null,
          montant,
          heures,
          client: { nom: res.nom, email: res.email, telephone: res.telephone },
          reserved: true,
        });
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: "accepted", placeNum } : r))
        );
      }
    }
  };

  const findFreePlace = () => {
    for (let i = 1; i <= 200; i++) {
      if (places[i] === null) return i;
    }
    return null;
  };

  // Admin refuse une réservation
  const refuserReservation = (id) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
  };

  // Supprimer une réservation de la liste
  const supprimerReservation = (id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ParkingContext.Provider
      value={{
        places,
        reservations,
        occuperPlace,
        libererPlace,
        mettreAJourSortie,
        soumettreReservation,
        accepterReservation,
        refuserReservation,
        supprimerReservation,
        findFreePlace,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (!context) throw new Error("useParking doit être utilisé à l'intérieur de ParkingProvider");
  return context;
}
