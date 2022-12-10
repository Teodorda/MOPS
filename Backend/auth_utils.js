const jwt = require("jsonwebtoken");
const axios = require("axios").default;

const consts = require("./const");
const privateKey = consts.private_key;

let access_token = "";

const getManagementApiToken = async () => {
  await axios
    .post(consts.oauth_token_url, {
      client_id: process.env.client_id,
      client_secret: process.env.client_secret,
      audience: consts.oauth_api_v2,
      grant_type: "client_credentials",
    })
    .then(function (response) {
      access_token = "Bearer " + response.data.access_token;
    });
};

const getAccessToken = () => access_token;

const generateJwtWithUserId = (userId) => {
  return jwt.sign({ user_id: userId }, privateKey);
};

const getUserIdFromJwt = (userJwt) => {
  try {
    user_id = jwt.verify(userJwt, privateKey).user_id;
    if (!user_id) {
      throw new Error();
    }
    return user_id;
  } catch (err) {
    return null;
  }
};

const getUserData = (userId) => {
  let options = {
    method: "GET",
    url: `${consts.oauth_api_v2}users/${userId}`,
    headers: { authorization: access_token },
  };

  return new Promise((resolve) => {
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        resolve(response.data);
      })
      .catch(function (error) {
        console.error(error);
        resolve(null);
      });
  });
};

const isUserAdmin = async (userId) => {
  const userData = await authUtils.getUserData(userId);
  return userData.user_metadata.admin === "true";
};

const canUserEditEntity = async (userId, entityId, getEntityFn) => {
  if (!userId) {
    return false;
  }

  const entity = await getEntityFn(entityId);
  if (!entity) {
    return false;
  }

  const isAdmin = await authUtils.isUserAdmin(userId);

  return isAdmin || entity.user_id === userId;
};

const authUtils = {
  getUserIdFromJwt,
  generateJwtWithUserId,
  getAccessToken,
  getManagementApiToken,
  getUserData,
  isUserAdmin,
  canUserEditEntity,
};

module.exports = authUtils;
