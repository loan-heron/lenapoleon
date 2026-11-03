require("dotenv").config();
const express = require("express");
const pool = require("./database/db.config");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

(async () => {

  try {

    await pool.query("SELECT 1");
    app.locals.db = pool;
    console.log("Base de donnée connectée et prête à l'emploi !");

    const routesDir = path.join(__dirname, "routes");
    const routesFiles = fs.readdirSync(routesDir).filter(file => file.endsWith(".js"));

    for (const file of routesFiles) {

      const route = require(path.join(routesDir, file));
      const routeName = file.replace(".route.js", "");

      app.use(`/api/${routeName}`, route);

      console.log(`Route chargée : /api/${routeName}`);

    }

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });

  } catch (err) {

    console.error("Impossible de se connecter à la base de données :", err.message);
    process.exit(1);

  }
})();
