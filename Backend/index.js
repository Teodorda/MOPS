require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const userUtils = require('./user_utils')
const productUtils = require('./product_utils')
const consts = require('./const')
const transactionUtils = require('./transaction_utils')
const axios = require('axios').default
app.use(cors())
app.use(express.json())

let access_token = '';

async function getManagementApiToken(){
    await axios.post(consts.oauth_token_url, {
        client_id: process.env.client_id,
        client_secret: process.env.client_secret,
        audience:  consts.oauth_api_v2,
        grant_type: 'client_credentials'
      })
      .then(function (response) {
        access_token = 'Bearer '+ response.data.access_token;
      });
}

getManagementApiToken();

app.post('/user', cors(), (req, res) => {
    userUtils.postUser(req, res, access_token);
});

app.post('/register', cors(), (req, res) => {
    userUtils.registerUser(req, res, access_token);
});

app.post('/login', cors(), (req, res) => {
    userUtils.loginUser(req, res, access_token);
});

app.post('/product', cors(), (req, res) => {
    productUtils.postProduct(req, res);
});

app.put('/product', cors(), (req, res) => {
    productUtils.putProduct(req, res);
});

app.delete('/product', cors(), (req, res) => {
    productUtils.deleteProduct(req, res);
});
  
app.get('/products', cors(), (req, res) => {
    productUtils.getProducts(req, res);
});

app.post('/historydonator', cors(), (req, res) => {
    transactionUtils.postHistoryDonator(req, res);
});

app.get('/historydonator', cors(), (req, res) => {
    transactionUtils.getHistoryDonator(req, res);
});

app.post('/historybeneficiary', cors(), (req, res) => {
    transactionUtils.postHistoryBeneficiary(req, res);
});

app.get('/historybeneficiary', cors(), (req, res) => {
    transactionUtils.getHistoryBeneficiary(req, res);
});

app.listen(3001, () => {
    console.log("Started listening on 3001");
});
