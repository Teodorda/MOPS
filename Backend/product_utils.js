const con = require("./db_con").con;
const auth_utils = require("./auth_utils");

const postProduct = (req, res) => {
  const nume = req.body.nume;
  const cantitate = req.body.cantitate;
  const tip = req.body.tip;
  const data_expirare = req.body.data_expirare;
  const adresa = req.body.adresa;
  const d = new Date();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  const userJwt = req.body.userJwt;
  const user_id = auth_utils.getUserIdFromJwt(userJwt);

  if (!user_id) {
    res.json({ add: "false" });
    return;
  }

  con.query(
    "INSERT INTO products (nume, cantitate, tip, data_expirare, adresa, luna, an, user_id) value ('" +
      nume +
      "', '" +
      cantitate +
      "', '" +
      tip +
      "', '" +
      data_expirare +
      "', '" +
      adresa +
      "', '" +
      month +
      "', '" +
      year +
      "', '" +
      user_id +
      "')",
    function (err, result, fields) {
      if (err) {
        res.json({ add: "false" });
      }
      res.json({ add: "true" });
    }
  );
};

const putProduct = async (req, res) => {
  const id = req.body.id;
  const nume = req.body.nume;
  const cantitate = req.body.cantitate;
  const tip = req.body.tip;
  const data_expirare = req.body.data_expirare;
  const adresa = req.body.adresa;
  const userJwt = req.body.userJwt;
  const user_id = auth_utils.getUserIdFromJwt(userJwt);

  if (await auth_utils.canUserEditEntity(user_id, id, getProductById)) {
    con.query(
      "UPDATE products SET nume='" +
        nume +
        "', cantitate='" +
        cantitate +
        "', tip='" +
        tip +
        "', data_expirare='" +
        data_expirare +
        "', adresa='" +
        adresa +
        "' WHERE id=" +
        id +
        "",
      function (err) {
        if (err) {
          res.json({ modify: "false" });
        }
        res.json({ modify: "true" });
      }
    );
  } else {
    res.json({ modify: "false" });
  }
};

const deleteProduct = async (req, res) => {
  const id = req.body.id;
  const userJwt = req.body.userJwt;
  const user_id = auth_utils.getUserIdFromJwt(userJwt);
  if (await auth_utils.canUserEditEntity(user_id, id, getProductById)) {
    con.query("DELETE FROM products WHERE id=" + id, function (err) {
      if (err) {
        res.json({ delete: "false" });
      }
      res.json({ delete: "true" });
    });
  } else {
    res.json({ delete: "false" });
  }
};

const getProducts = (req, res) => {
  con.query("SELECT * FROM products", async function (err, result) {
    if (!result || err) {
      res.json({ products: "error" });
      return;
    }

    const userIds = [...new Set(result.map(r => r.user_id))];
    const users = await Promise.all(userIds.map(user_id => auth_utils.getUserData(user_id)));
    const products = result.map(r => ({
      ...r, user: users.find(u => u.user_id === r.user_id)
    }))
    res.json({products});
  });
};

const getProductById = (productId) => {
  return new Promise((resolve) => {
    con.query(
      `SELECT * FROM products WHERE id=${productId}`,
      function (err, result) {
        if (err) {
          resolve(null);
        }

        resolve(result[0]);
      }
    );
  });
};


module.exports = { postProduct, putProduct, deleteProduct, getProducts };
