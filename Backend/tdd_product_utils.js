const con = require("./db_con").con;
const auth_utils = require("./auth_utils");

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

module.exports = { getProducts };
