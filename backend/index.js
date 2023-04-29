const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;

app.use(cors());
app.use(express.json());