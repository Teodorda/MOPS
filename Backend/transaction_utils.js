const con = require("./db_con").con

const postHistoryDonator = (req, res) => {
    const id_product = req.body.id_product
    const name = req.body.name
    const cantitate = req.body.cantitate
    const donator = req.body.donator
    const user_id = req.body.user_id

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
                console.log(err)
            }
        }
    )

    con.query("DELETE FROM products WHERE id=" + id_product,
        function (err) {
            if (err) {
                console.log(err)
            }
            res.json({ transfer: 'true' })
        }
    )
}


const getHistoryDonator = (req, res) => {

    const user_id = req.body.user_id

    con.query(
        "SELECT * FROM history_donator WHERE user_id='" + user_id + "'",
        function (err, result, fields) {
            if (err) {
                res.json({ products: 'error' })
            }

            res.json({ history: result })

        })
}

const postHistoryBeneficiary = (req, res) => {
    const id_cerere = req.body.id_cerere
    const name = req.body.name
    const cantitate = req.body.cantitate
    const beneficiar = req.body.beneficiar
    const user_id = req.body.user_id

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
                console.log(err)
            }
        }
    )

    con.query("DELETE FROM cereri WHERE id=" + id_cerere,
        function (err) {
            if (err) {
                console.log(err)
            }
            res.json({ transfer: 'true' })
        }
    )
}

 const getHistoryBeneficiary = (req, res) => {

    const user_id = req.body.user_id

    con.query(
        "SELECT * FROM history_beneficiar WHERE user_id='" + user_id + "'",
        function (err, result, fields) {
            if (err) {
                res.json({ products: 'error' })
            }

            res.json({ history: result })

        })
}

const getRequest = (req, res) => {
    con.query(
        "SELECT * FROM cereri",
        function (err, result, fields) {
            if (err) {
                res.json({ products: 'error' })
            }

            res.json({ products: result})
            
    })
};

const deleteRequest = (req, res) => {
    const id = req.body.id

    con.query(
        "DELETE FROM cereri WHERE id="+id,
        function (err, result, fields) {
        if (err) {
            res.json({ delete: 'false' })
        }
        res.json({ delete: 'true' })
        }
    )
}

const addRequest = (req, res) => {
    const nume = req.body.nume
    const cantitate = req.body.cantitate
    const adresa = req.body.adresa
    const d = new Date();
    let month = d.getMonth()+1;
    let year = d.getFullYear();
    const user_id = req.body.user_id

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
        function (err, result, fields) {
        if (err) {
            res.json({ add: 'false' })
        }
        res.json({ add: 'true' })
        }
    )
}

const modifyRequest = (req, res) => {
    const id = req.body.id
    const nume = req.body.nume
    const cantitate = req.body.cantitate
    const adresa = req.body.adresa

    con.query(
        "UPDATE cereri SET nume='"+nume+"', cantitate='"+cantitate+"', adresa='"+adresa+"' WHERE id="+id+"",
        function (err, result, fields) {
        if (err) {
            res.json({ modify: 'false' })
        }
        res.json({ modify: 'true' })
        }
    )
}

module.exports = {
    postHistoryDonator,
    getHistoryDonator,
    postHistoryBeneficiary,
    getHistoryBeneficiary,
    addRequest,
    deleteRequest,
    getRequest,
    modifyRequest
}

