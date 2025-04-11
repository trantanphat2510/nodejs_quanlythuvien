require("dotenv").config();
const express = require("express");
const cors = require("cors");
const configViewEngine = require("./router/viewEngine");
const webRoutes = require("./router/web");
const app = express();
const port = process.env.PORT || 8080;
const session = require('express-session');


app.use(session({
  secret: 'your_secret_key',   
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

configViewEngine(app);
app.use(express.json());
app.use(cors());
app.use("/", webRoutes);
app.use("/register", webRoutes);
app.use("/login", webRoutes);
app.use("/getUserSession", webRoutes);

app.use((err, req, res, next) => {
  console.error("Lỗi hệ thống:", err);
  res.status(500).json({ error: "Lỗi hệ thống!" });
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
