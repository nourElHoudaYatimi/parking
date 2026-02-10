import { createContext, useContext, useState } from "react";

export const ParkingContext = createContext();

export function ParkingProvider({ children }) {
  const [places, setPlaces] = useState(() => {
    const obj = {};
    for (let i = 1; i <= 200; i++) obj[i] = null; // null = libre
    return obj;
  });

  const occuperPlace = (num, data) => {
    setPlaces((prev) => ({ ...prev, [num]: data }));
  };

  const libererPlace = (num) => {
    setPlaces((prev) => ({ ...prev, [num]: null }));
  };

  const mettreAJourSortie = (num, heureSortie, montant, heures) => {
    setPlaces((prev) => ({
      ...prev,
      [num]: prev[num]
        ? { ...prev[num], heureSortie, montant, heures }
        : null,
    }));
  };

  return (
    <ParkingContext.Provider
      value={{
        places,
        occuperPlace,
        libererPlace,
        mettreAJourSortie,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);

  if (!context) {
    throw new Error("useParking doit être utilisé à l'intérieur de ParkingProvider");
  }

  return context;
}
