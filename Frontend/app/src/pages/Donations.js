import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../assets/css/style.css";
import Nav from "./Nav";
import { useAuth } from "../AuthContext";
import { API_URL } from "../const";
import Footer from "./Footer";
import Avatar from "./Avatar";

const Donations = () => {
  const [offerName, setOfferName] = useState("");
  const [offerQty, setOfferQty] = useState("");
  const [offerType, setOfferType] = useState("");
  const [offerAddress, setOfferAddress] = useState("");
  const [offerExpDate, setOfferExpDate] = useState("");
  const [personalProducts, setPersonalProducts] = useState([]);
  const [generalProducts, setGeneralProducts] = useState([]);

  const { userJwt, currentUser, isAdmin } = useAuth();

  const navigate = useNavigate();

  const addOffer = (event) => {
    const product = {
      nume: offerName,
      cantitate: offerQty,
      tip: offerType,
      adresa: offerAddress,
      data_expirare: offerExpDate,
      userJwt,
    };

    axios.post(`${API_URL}/product`, product).then((res) => {
      navigate("/donations");
    });
  };

  useEffect(() => {
    axios.get(`${API_URL}/products`).then((res) => {
      console.log(res);
      let prod = res.data.products;
      let produse = [];
      let produsegeneral = [];
      for (let i = 0; i < prod.length; i++) {
        if (isAdmin() || prod[i].user_id === currentUser?.user_id) {
          produse.push(
            <Product
              key={prod[i].id}
              id={prod[i].id}
              name={prod[i].nume}
              qty={prod[i].cantitate}
              expDate={prod[i].data_expirare}
              location={prod[i].adresa}
              type={prod[i].tip}
              user={prod[i].user}
            />
          );
        } else {
          produsegeneral.push(
            <GeneralProduct
              id={prod[i].id}
              key={prod[i].id}
              name={prod[i].nume}
              qty={prod[i].cantitate}
              expDate={prod[i].data_expirare}
              location={prod[i].adresa}
              user_id={prod[i].user_id}
              type={prod[i].tip}
              user={prod[i].user}
            />
          );
        }
      }
      setPersonalProducts(produse);
      setGeneralProducts(produsegeneral);
    });
  }, []);

  return (
    <div>
      <div id="wrapper">
        <Nav />
        <div className="d-flex flex-column" id="content-wrapper">
          <div id="content" style={{ paddingTop: "80px" }}>
            <div className="container-fluid">
              <h3 className="text-dark mb-4">Produse Donate</h3>
              <div className="card shadow" style={{ marginBottom: "10px" }}>
                <div className="card-header py-3">
                  <p className="text-primary m-0 font-weight-bold">
                    Adauga un produs
                  </p>
                </div>
                <form onSubmit={addOffer}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <label className="col-form-label">Nume</label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          value={offerName}
                          onChange={(e) => setOfferName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label className="col-form-label">Cantitate</label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          value={offerQty}
                          onChange={(e) => setOfferQty(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label className="col-form-label">Marca produs</label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          value={offerType}
                          onChange={(e) => setOfferType(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label className="col-form-label">
                          Adresa de preluare
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          value={offerAddress}
                          onChange={(e) => setOfferAddress(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <label className="col-form-label">
                          Data de expirare
                        </label>
                      </div>
                      <div className="col">
                        <input
                          type="date"
                          value={offerExpDate}
                          onChange={(e) => setOfferExpDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col text-center"
                        style={{ marginTop: "10px" }}
                      >
                        <div className="btn-group" role="group">
                          <button className="btn btn-primary" type="submit">
                            Adauga
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {!isAdmin() && (
                <div className="card shadow">
                  <div className="card-header py-3">
                    <p className="text-primary m-0 font-weight-bold">
                      Toate Produsele
                    </p>
                  </div>
                  <div className="card-body">
                    <div
                      className="table-responsive table mt-2"
                      id="dataTable"
                      role="grid"
                      aria-describedby="dataTable_info"
                    >
                      <table className="table dataTable my-0" id="dataTable">
                        <thead>
                          <tr>
                            <th>Donator</th>
                            <th>Nume</th>
                            <th>Cantitate</th>
                            <th>Marca produs</th>
                            <th>Adresa de preluare</th>
                            <th>Data de expirare</th>
                            <th>Creaza o cerere</th>
                          </tr>
                        </thead>
                        <tbody>{generalProducts}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <div className="card shadow" style={{ marginTop: "10px" }}>
                <div className="card-header py-3">
                  <p className="text-primary m-0 font-weight-bold">
                    {isAdmin() ? "Toate Produsele" : "Produsele Mele"}
                  </p>
                </div>
                <div className="card-body">
                  <div
                    className="table-responsive table mt-2"
                    id="dataTable"
                    role="grid"
                    aria-describedby="dataTable_info"
                  >
                    <table className="table dataTable my-0" id="dataTable">
                      <thead>
                        <tr>
                          <th>Donator</th>
                          <th>Nume</th>
                          <th>Cantitate</th>
                          <th>Marca produs</th>
                          <th>Adresa de preluare</th>
                          <th>Data de expirare</th>
                          <th>Modifica Produs</th>
                          <th>Sterge produse</th>
                        </tr>
                      </thead>
                      <tbody>{personalProducts}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

const Product = ({ name, qty, type, location, expDate, id, user }) => {
  const [productName, setProductName] = useState(name);
  const [productQty, setProductQty] = useState(qty);
  const [productType, setProductType] = useState(type);
  const [productLocation, setProductLocation] = useState(location);
  const [productExpDate, setProductExpDate] = useState(expDate);
  const [productId, setProductId] = useState(id);

  const navigate = useNavigate();

  const { userJwt } = useAuth();

  const modifyOffer = () => {
    const product = {
      id: productId,
      nume: productName,
      cantitate: productQty,
      tip: productType,
      adresa: productLocation,
      data_expirare: productExpDate,
      userJwt,
    };

    axios.put(`${API_URL}/product`, product).then(() => {
      navigate("/donations");
    });
  };

  const deleteOffer = (event) => {
    const product = {
      id: productId,
      userJwt,
    };

    axios
      .delete(`http://localhost:3001/product`, { data: product })
      .then(() => {
        navigate("/donations");
      });
  };

  return (
    <tr>
      <td>
        <Avatar user={user} />
        &nbsp;&nbsp;{user.username}
      </td>
      <input
        type="hidden"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <td>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={productQty}
          onChange={(e) => setProductQty(e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        />
      </td>
      <td>
        <input
          type="text"
          value={productLocation}
          onChange={(e) => setProductLocation(e.target.value)}
        />
      </td>
      <td>
        <input
          type="date"
          value={productExpDate}
          onChange={(e) => setProductExpDate(e.target.value)}
        />
      </td>
      <td>
        <button className="btn btn-warning" type="button" onClick={modifyOffer}>
          Modifica
        </button>
      </td>
      <td>
        <button className="btn btn-danger" type="button" onClick={deleteOffer}>
          Sterge
        </button>
      </td>
    </tr>
  );
};

const GeneralProduct = ({
  name,
  qty,
  type,
  location,
  expDate,
  user_id,
  id,
  user,
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const makeRequest = (event) => {
    const history = {
      id_product: id,
      name: name,
      cantitate: qty,
      donator: user_id,
      user_id: currentUser?.user_id,
    };

    axios.post(`${API_URL}/historydonator`, history).then((res) => {
      navigate("/profile");
    });
  };

  return (
    <tr>
      <td>
        <Avatar user={user} />
        &nbsp;&nbsp;{user.username}
      </td>
      <td>{name}</td>
      <td>{qty}</td>
      <td>{type}</td>
      <td>{location}</td>
      <td>{expDate}</td>
      <td>
        <button className="btn btn-primary" type="button" onClick={makeRequest}>
          Cere produsele
        </button>
      </td>
    </tr>
  );
};

export default Donations;
