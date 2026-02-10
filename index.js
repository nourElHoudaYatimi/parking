const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("SERVER OK 🚀");
});

app.listen(3000, () => {
  console.log("SERVER LISTENING ON 3000");
});

