require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const main = require("./routes/main");
const { connectDB } = require("./modules/connectDB");

const app = express();


app.listen(process.env.PORT, () => {
  console.log("server listening on port");
});
connectDB();
app.use(
  cors({
    origin: [process.env.URL],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use("/", main);
