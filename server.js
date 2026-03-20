require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/user.routes");

const app = express();

// ✅ IMPORTANT: allow Angular
app.use(cors({
  origin: "*"
}));

app.use(express.json());

connectDB();

app.use("/", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});