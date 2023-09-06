import cors from "cors";
import express from "express";
import routes from "./route.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

global.__basedir = __dirname;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

app.listen(port, () => {
  console.log(`Gateway http://localhost:${port}`);
});