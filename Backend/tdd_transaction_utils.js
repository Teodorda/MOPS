const con = require("./db_con").con;

const getHistoryDonator = (req, res) => {
  const user_id = req.body.user_id;

  con.query(
    "SELECT * FROM history_donator WHERE user_id='" + user_id + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        res.json({ history: "error" });
        return;
      }

      res.json({ history: result });
    }
  );
};

const getHistoryBeneficiary = (req, res) => {
  const user_id = req.body.user_id;

  con.query(
    "SELECT * FROM history_beneficiar WHERE user_id='" + user_id + "'",
    function (err, result) {
      if (err) {
        console.log(err);
        res.json({ history: "error" });
        return;
      }

      res.json({ history: result });
    }
  );
};

module.exports = {
  getHistoryDonator,
  getHistoryBeneficiary,
};