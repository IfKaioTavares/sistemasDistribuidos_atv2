import { Express } from "express"
import express = require("express");
import { createRouter } from "./routers/routes";

const app: Express = express();

app.use(express.json());

const args = process.argv.slice(2);
const port = parseInt(args[0]);

app.use("/", createRouter(port));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});