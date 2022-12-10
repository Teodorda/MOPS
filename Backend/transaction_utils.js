const con = require("./db_con").con;

const postHistoryDonator = (req, res) => {
  const id_product = req.body.id_product;
  const name = req.body.name;
  const cantitate = req.body.cantitate;
  const donator = req.body.donator;
  const user_id = req.body.user_id;

  con.query(
    "INSERT INTO history_donator (name, cantitate, donator, user_id) value ('" +
      name +
      "', '" +
      cantitate +
      "', '" +
      donator +
      "', '" +
      user_id +
      "')",
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  con.query("DELETE FROM products WHERE id=" + id_product, function (err) {
    if (err) {
      console.log(err);
    }
    res.json({ transfer: "true" });
  });
};

const getHistoryDonator = (req, res) => {
  const user_id = req.body.user_id;

  con.query(
    "SELECT * FROM history_donator WHERE user_id='" + user_id + "'",
    function (err, result, fields) {
      if (err) {
        res.json({ products: "error" });
      }

      res.json({ history: result });
    }
  );
};

const postHistoryBeneficiary = (req, res) => {
  const id_cerere = req.body.id_cerere;
  const name = req.body.name;
  const cantitate = req.body.cantitate;
  const beneficiar = req.body.beneficiar;
  const user_id = req.body.user_id;

  con.query(
    "INSERT INTO history_beneficiar (name, cantitate, beneficiar, user_id) value ('" +
      name +
      "', '" +
      cantitate +
      "', '" +
      beneficiar +
      "', '" +
      user_id +
      "')",
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  con.query("DELETE FROM cereri WHERE id=" + id_cerere, function (err) {
    if (err) {
      console.log(err);
    }
    res.json({ transfer: "true" });
  });
};

const getHistoryBeneficiary = (req, res) => {
  const user_id = req.body.user_id;

  con.query(
    "SELECT * FROM history_beneficiar WHERE user_id='" + user_id + "'",
    function (err, result, fields) {
      if (err) {
        res.json({ products: "error" });
      }

      res.json({ history: result });
    }
  );
};

module.exports = {
  postHistoryDonator,
  getHistoryDonator,
  postHistoryBeneficiary,
  getHistoryBeneficiary,
};
