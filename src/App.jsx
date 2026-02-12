import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Frontend React</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;

