require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const userUtils = require("./user_utils");
const productUtils = require("./product_utils");
const requestUtils = require("./request_utils");
const transactionUtils = require("./transaction_utils");
const auth_utils = require("./auth_utils");
app.use(cors());
app.use(express.json());

auth_utils.getManagementApiToken();

app.get("/user", cors(), (req, res) => {
  userUtils.getUser(req, res);
});

app.post("/register", cors(), (req, res) => {
  userUtils.registerUser(req, res);
});

app.post("/login", cors(), (req, res) => {
  userUtils.loginUser(req, res);
});

app.post("/product", cors(), (req, res) => {
  productUtils.postProduct(req, res);
});

app.put("/product", cors(), async (req, res) => {
  await productUtils.putProduct(req, res);
});

app.delete("/product", cors(), async (req, res) => {
  await productUtils.deleteProduct(req, res);
});

app.get("/products", cors(), (req, res) => {
  productUtils.getProducts(req, res);
});

app.post("/historydonator", cors(), (req, res) => {
  transactionUtils.postHistoryDonator(req, res);
});

app.get("/historydonator", cors(), (req, res) => {
  transactionUtils.getHistoryDonator(req, res);
});

app.post("/historybeneficiary", cors(), (req, res) => {
  transactionUtils.postHistoryBeneficiary(req, res);
});

app.get("/historybeneficiary", cors(), (req, res) => {
  transactionUtils.getHistoryBeneficiary(req, res);
});

app.get("/requests", cors(), (req, res) => {
  requestUtils.getRequests(req, res);
});

app.post("/request", cors(), (req, res) => {
  requestUtils.postRequest(req, res);
});

app.put("/request", cors(), async (req, res) => {
  await requestUtils.putRequest(req, res);
});

app.delete("/request", cors(), async (req, res) => {
  await requestUtils.deleteRequest(req, res);
});

app.listen(3001, () => {
  console.log("Started listening on 3001");
});
