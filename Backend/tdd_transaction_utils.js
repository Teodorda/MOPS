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

const postHistoryDonator = (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request Body is missing");
    }

    con.query(
      `INSERT INTO history_donator (name, cantitate, donator, user_id) value ('${req.body.name}', '${req.body.cantitate}', '${req.body.donator}', '${req.body.user_id}')`,
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

const postHistoryBeneficiary = (req, res) => {
  try {
    if (!req.body) {
      throw new Error("Request Body is missing");
    }
    
    con.query(
      `INSERT INTO history_beneficiar (name, cantitate, beneficiar, user_id) value ('${req.body.name}', '${req.body.cantitate}', '${req.body.beneficiar}', '${req.body.user_id}')`,
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

module.exports = {
  getHistoryDonator,
  getHistoryBeneficiary,
  postHistoryDonator,
  postHistoryBeneficiary,
};
