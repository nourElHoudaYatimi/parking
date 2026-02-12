import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [parking, setParking] = useState([]);

  const fetchParking = async () => {
    const res = await fetch("http://localhost:5008/api/parking");
    const data = await res.json();
    setParking(data);
  };

  useEffect(() => {
    fetchParking();
  }, []);

  const toggleStatus = async (id) => {
    await fetch(`http://localhost:5008/api/parking/${id}`, {
      method: "PUT",
    });
    fetchParking();
  };

  const freeCount = parking.filter(p => p.status === "free").length;
  const occupiedCount = parking.filter(p => p.status === "occupied").length;

  return (
    <div className="container">
      <h1>🚗 Smart Parking System</h1>

      <div className="stats">
        <div className="card-stat">Total: {parking.length}</div>
        <div className="card-stat free-stat">Free: {freeCount}</div>
        <div className="card-stat occupied-stat">Occupied: {occupiedCount}</div>
      </div>

      <div className="parking-layout">
        <div className="side">
          {parking.slice(0, 50).map((spot) => (
            <div
              key={spot.id}
              className={`spot ${spot.status}`}
              onClick={() => toggleStatus(spot.id)}
            >
              {spot.number}
            </div>
          ))}
        </div>

        <div className="road">ROAD</div>

        <div className="side">
          {parking.slice(50, 100).map((spot) => (
            <div
              key={spot.id}
              className={`spot ${spot.status}`}
              onClick={() => toggleStatus(spot.id)}
            >
              {spot.number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;


