const axios = require('axios').default
const consts = require('./const')

const postUser = (req, res, access_token) => {
    user_id = req.body.user_id

    let options = {
        method: 'GET',
        url: `${consts.oauth_api_v2}users/`+user_id,
        headers: {authorization: access_token}
    };
    
    axios.request(options)
    .then(function (response) {
        console.log(response.data);
        res.json({user : response.data});
    })
    .catch(function (error) {
        console.error(error);
    });
}

const registerUser = (req, res, access_token) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const phone = req.body.phone; 
    const address = req.body.address; 
    const pass = req.body.password;
    const reppass = req.body.repeatpassword;

    if(pass === reppass)
    {
        axios.post(`${consts.oauth_api_v2}users`, {
            email: email,
            username: fname+''+lname,
            given_name: fname,
            family_name: lname,
            connection: 'Username-Password-Authentication',
            password: pass,
            user_metadata: {
                phone: phone,
                address: address,
                admin: 'false'
            }
        },
        {
            headers: {
                Authorization : access_token
            }
        })
            .then(function (response) {
                res.json({register : 'true'});
        })
        .catch((error) => {
            console.log(error)
          });;
    }
    else
    {
      res.json({register : 'false'});
    }
}

const loginUser = (req, res, access_token) => {
    const email = req.body.email;
    const pass = req.body.password;

    axios.post(consts.oauth_token_url, {
        grant_type : 'password',
        username: email,
        password: pass,
        audience:  `${consts.oauth_api_v2}`,
        scope: 'read:current_user',
        client_id: process.env.client_id,
        client_secret: process.env.client_secret
    })
    .then(function (response) {

        let options = {
            method: 'GET',
            url: `${consts.oauth_api_v2}users-by-email`,
            params: {email: email},
            headers: {authorization: access_token}
        };

        axios.request(options).then(function (response) {
            res.json({ user_id: response.data[0].user_id });
          }).catch(function (error) {
            console.error(error);
            res.json({ user_id: 'false' });
          });

    })
    .catch((error) => {
        console.log(error)
        res.json({ user_id: 'false' });
    });
}

module.exports = {
    postUser,
    registerUser,
    loginUser
}
