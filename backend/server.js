const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: "https://tranquil-blancmange-5781d6.netlify.app/", // ✅ exact Netlify URL
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const itemRoutes = require('./routes/itemroutes');
app.use('/api/items', itemRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
