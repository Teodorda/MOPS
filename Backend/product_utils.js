const con = require("./db_con").con

const postProduct = (req, res) => {
    const nume = req.body.nume
    const cantitate = req.body.cantitate
    const tip = req.body.tip
    const data_expirare = req.body.data_expirare
    const adresa = req.body.adresa
    const d = new Date();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    const user_id = req.body.user_id

    con.query(
        "INSERT INTO products (nume, cantitate, tip, data_expirare, adresa, luna, an, user_id) value ('" +
        nume +
        "', '" +
        cantitate +
        "', '" +
        tip +
        "', '" +
        data_expirare +
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

const putProduct = (req, res) => {
    const id = req.body.id
    const nume = req.body.nume
    const cantitate = req.body.cantitate
    const tip = req.body.tip
    const data_expirare = req.body.data_expirare
    const adresa = req.body.adresa

    con.query(
        "UPDATE products SET nume='" + nume + "', cantitate='" + cantitate + "', tip='" + tip + "', data_expirare='" + data_expirare + "', adresa='" + adresa + "' WHERE id=" + id + "",
        function (err, result, fields) {
            if (err) {
                res.json({ modify: 'false' })
            }
            res.json({ modify: 'true' })
        }
    )
}

const deleteProduct = (req, res) => {
    const id = req.body.id

    con.query(
        "DELETE FROM products WHERE id=" + id,
        function (err, result, fields) {
            if (err) {
                res.json({ delete: 'false' })
            }
            res.json({ delete: 'true' })
        }
    )
}

module.exports = {postProduct, putProduct, deleteProduct}
