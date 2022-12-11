const axios = require("axios").default;

const consts = require("./const");
const auth_utils = require("./auth_utils");

const getUser = (req, res) => {
  user_id = req.body.user_id;

  auth_utils.getUserData(user_id).then((user) => {
    user && res.json({ user });
  });
};

const registerUser = (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const phone = req.body.phone;
  const address = req.body.address;
  const pass = req.body.password;
  const reppass = req.body.repeatpassword;

  if (pass === reppass) {
    axios
      .post(
        `${consts.oauth_api_v2}users`,
        {
          email: email,
          username: fname + "" + lname,
          given_name: fname,
          family_name: lname,
          connection: "Username-Password-Authentication",
          password: pass,
          user_metadata: {
            phone: phone,
            address: address,
            admin: "false",
          },
        },
        {
          headers: {
            Authorization: auth_utils.getAccessToken(),
          },
        }
      )
      .then(function (response) {
        res.json({ register: true });
      })
      .catch((error) => {
        console.log(error);
        res.json({ register: false });
      });
  } else {
    res.json({ register: false });
  }
};

const loginUser = (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;

  axios
    .post(consts.oauth_token_url, {
      grant_type: "password",
      username: email,
      password: pass,
      audience: `${consts.oauth_api_v2}`,
      scope: "read:current_user",
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
    })
    .then(function (response) {
      let options = {
        method: "GET",
        url: `${consts.oauth_api_v2}users-by-email`,
        params: { email: email },
        headers: { authorization: auth_utils.getAccessToken() },
      };

      axios
        .request(options)
        .then(function (response) {
          const userJwt = auth_utils.generateJwtWithUserId(
            response.data[0].user_id
          );
          res.json({ userJwt });
        })
        .catch(function (error) {
          console.error(error);
          res.json({ userJwt: "false" });
        });
    })
    .catch((error) => {
      console.log(error);
      res.json({ userJwt: "false" });
    });
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
};
