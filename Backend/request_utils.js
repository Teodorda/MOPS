const con = require("./db_con").con;
const auth_utils = require("./auth_utils");

const getRequests = (req, res) => {
  con.query("SELECT * FROM cereri", async function (err, result, fields) {
    if (err) {
      res.json({ requests: "error" });
    }
    const userIds = [...new Set(result.map(r => r.user_id))];
    const users = await Promise.all(userIds.map(user_id => auth_utils.getUserData(user_id)));
    const requests = result.map(r => ({
      ...r, user: users.find(u => u.user_id === r.user_id)
    }))
    res.json({ requests });
  });
};

const deleteRequest = async (req, res) => {
  const id = req.body.id;
  const userJwt = req.body.userJwt;
  const user_id = auth_utils.getUserIdFromJwt(userJwt);

  if (await auth_utils.canUserEditEntity(user_id, id, getRequestById)) {
    con.query(
      "DELETE FROM cereri WHERE id=" + id,
      function (err) {
        if (err) {
          res.json({ delete: "false" });
        }
        res.json({ delete: "true" });
      }
    );
  } else {
    res.json({ delete: "false" });
  }
};

const postRequest = (req, res) => {
  const nume = req.body.nume;
  const cantitate = req.body.cantitate;
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
    "INSERT INTO cereri (nume, cantitate, adresa, luna, an, user_id) value ('" +
      nume +
      "', '" +
      cantitate +
      "', '" +
      adresa +
      "', '" +
      month +
      "', '" +
      year +
      "', '" +
      user_id +
      "')",
    function (err) {
      if (err) {
        res.json({ add: "false" });
      }
      res.json({ add: "true" });
    }
  );
};

const putRequest = async (req, res) => {
  const id = req.body.id;
  const nume = req.body.nume;
  const cantitate = req.body.cantitate;
  const adresa = req.body.adresa;
  const userJwt = req.body.userJwt;
  const user_id = auth_utils.getUserIdFromJwt(userJwt);

  if (await auth_utils.canUserEditEntity(user_id, id, getRequestById)) {
    console.log("CAN EDIT");
  con.query(
    "UPDATE cereri SET nume='" +
      nume +
      "', cantitate='" +
      cantitate +
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

const getRequestById = (requestId) => {
  return new Promise((resolve) => {
    con.query(
      `SELECT * FROM cereri WHERE id=${requestId}`,
      function (err, result) {
        if (err) {
          resolve(null);
        }

        resolve(result[0]);
      }
    );
  });
};

module.exports = {
  postRequest,
  deleteRequest,
  getRequests,
  putRequest,
};
