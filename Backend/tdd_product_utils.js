const con = require("./db_con").con;
const auth_utils = require("./auth_utils");

const getProducts = (res) => {
  con.query("SELECT * FROM products", async (err, products) => {
    try {
      if (err) {
        throw err;
      }

      const users = [...new Set(products.map((p) => p.user_id))];
      const usersData = await Promise.all(
        users.map((u) => auth_utils.getUserData(u))
      );
      const newProducts = products.map((p) => ({
        ...p,
        user: usersData.find((user) => user.user_id === p.user_id),
      }));
      res.json({ products: newProducts });
    } catch (e) {
      console.log(e);
      res.json({ products: "error" });
    }
  });
};

const postProduct = (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request Body is missing");
    }
    
    const userId = auth_utils.getUserIdFromJwt(req.body.userJwt);
    if (!userId) {
      throw new Error("Bad User JWT");
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    con.query(
      `INSERT INTO products (nume, cantitate, tip, data_expirare, adresa, luna, an, user_id) value ('${req.body.nume}', '${req.body.cantitate}', '${req.body.tip}', '${req.body.data_expirare}', '${currentMonth}', '${currentYear}', '${userId}')`,
      (err) => {
        if (err) {
          console.log(err);
          res.json({ add: "false" });
        } else {
          res.json({ add: "true" });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ add: "false" });
  }
};

const getRequests = (res) => {
  con.query("SELECT * FROM cereri", async (err, requests) => {
    try {
      if (err) {
        throw err;
      }

      const users = [...new Set(requests.map((r) => r.user_id))];
      const usersData = await Promise.all(
        users.map((u) => auth_utils.getUserData(u))
      );
      const newRequests = requests.map((r) => ({
        ...r,
        user: usersData.find((user) => user.user_id === r.user_id),
      }));
      res.json({ requests: newRequests });
    } catch (e) {
      console.log(e);
      res.json({ requests: "error" });
    }
  });
};

module.exports = { getProducts, postProduct, getRequests };
