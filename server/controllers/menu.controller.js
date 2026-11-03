exports.getAllMenus = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { rows: menus } = await db.query('SELECT nom FROM menus');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { rows: menus } = await db.query(`SELECT nom FROM menus WHERE id = ${id}`);
    if (menus.length === 0) {
      return res.status(404).json({ error: `Le menu avec l'id ${id} n'existe pas`});
    }
    res.json(menus[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMenu = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { nom } = req.body;
    const { rows: menus } = await db.query('INSERT INTO menus (nom) VALUES ($1) RETURNING *', [nom]);
    res.status(201).json(menus[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { nom } = req.body;
    const { rows: menus } = await db.query('UPDATE menus SET nom = $1 WHERE id = $2 RETURNING *', [nom, id]);
    if (menus.length === 0) {
      return res.status(404).json({ error: `Le menu avec l'id ${id} n'existe pas`});
    }
    res.json(menus[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM menus WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: `Le menu avec l'id ${id} n'existe pas`});
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
