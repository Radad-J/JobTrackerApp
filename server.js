require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "ejs");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const viewsRouter = require("./routes/viewsRoutes");

app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use(viewsRouter);
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
