const con = require("./db_con").con;
const auth_utils = require("./auth_utils");

const getProducts = (res) => {
  con.query('SELECT * FROM products', async (err, products) => {
    try {
      if (err) {
        throw err;
      }

      const users = [...new Set(products.map((p) => p.user_id))]
      const usersData = await Promise.all(users.map((u) => auth_utils.getUserData(u)))
      const newProducts = products.map((p) => ({ ...p, user: usersData.find((user) => user.user_id === p.user_id) }))
      res.json({ products: newProducts });
    } catch (e) {
      console.log(e);
      res.json({ products: 'error' });
    }
  })
};

const getRequests = (res) => {
  con.query('SELECT * FROM cereri', async (err, requests) => {
    try {
      if (err) {
        throw err;
      }

      const users = [...new Set(requests.map((r) => r.user_id))]
      const usersData = await Promise.all(users.map((u) => auth_utils.getUserData(u)))
      const newRequests = requests.map((r) => ({ ...r, user: usersData.find((user) => user.user_id === r.user_id) }))
      res.json({ requests: newRequests });
    } catch (e) {
      console.log(e);
      res.json({ requests: 'error' });
    }
  })
};

module.exports = { getProducts, getRequests };
