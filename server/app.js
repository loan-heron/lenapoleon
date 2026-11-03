require("dotenv").config();
const express = require("express");
const pool = require("./database/db.config");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
  try {
    await pool.query("SELECT 1");
    app.locals.db = pool;
    console.log("Base de données connectée et prête à l'emploi !");

    const routesDir = path.join(__dirname, "routes");
    const routeFiles = fs
      .readdirSync(routesDir)
      .filter((file) => file.endsWith(".route.js"))
      .sort();

    for (const file of routeFiles) {
      const route = require(path.join(routesDir, file));
      const routeName = path.basename(file, ".route.js");
      app.use(`/api/${routeName}`, route);
      console.log(`Route chargée : /api/${routeName}`);
    }

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Impossible de démarrer le serveur :", err.message);
    process.exit(1);
  }
}

startServer();
