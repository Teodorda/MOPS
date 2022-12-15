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

module.exports = { getProducts };
