require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

connectDB();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.get("/test", (req, res) => {
  res.send("Server is up and Running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
