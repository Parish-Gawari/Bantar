require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
connectDB();
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.get("/test", (req, res) => {
  res.send("Server is up and Running");
});

app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
