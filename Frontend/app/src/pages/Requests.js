import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Nav from "./Nav";
import Footer from "./Footer";
import Avatar from "./Avatar";
import { useAuth } from "../AuthContext";
import { API_URL } from "../const";

import "../assets/css/style.css";
import "../assets/bootstrap/css/bootstrap.min.css";
import "../assets/fonts/fontawesome-all.min.css";

const Requests = () => {
  const [requestName, setRequestName] = useState("");
  const [requestQty, setRequestQty] = useState("");
  const [requestAddress, setRequestAddress] = useState("");
  const [personalRequests, setPersonalRequests] = useState([]);
  const [generalRequests, setGeneralRequests] = useState([]);

  const { userJwt, currentUser, isAdmin } = useAuth();

  const navigate = useNavigate();

  const addRequest = (event) => {
    const product = {
      nume: requestName,
      cantitate: requestQty,
      adresa: requestAddress,
      userJwt,
    };

    axios.post(`${API_URL}/request`, product).then((res) => {
      navigate("/requests");
    });
  }

  useEffect(() => {
    axios.get(`${API_URL}/requests`).then((res) => {
      let reqs = res.data.requests;
      let cereri = [];
      let cererigenerale = [];
      for (let i = 0; i < reqs.length; i++) {
        if (isAdmin() || reqs[i].user_id === currentUser?.user_id) {
          cereri.push(
            <Request
              id={reqs[i].id}
              key={reqs[i].id}
              name={reqs[i].nume}
              qty={reqs[i].cantitate}
              location={reqs[i].adresa}
              user={reqs[i].user}
            />
          );
        } else {
          cererigenerale.push(
            <GeneralRequest
              id={reqs[i].id}
              key={reqs[i].id}
              name={reqs[i].nume}
              qty={reqs[i].cantitate}
              location={reqs[i].adresa}
              user_id={reqs[i].user_id}
              user={reqs[i].user}
            />
          );
        }
      }
      setPersonalRequests(cereri);
      setGeneralRequests(cererigenerale);
    });
  }, []);

  return (
    <div>
      <div id="wrapper">
        <Nav />
        <div className="d-flex flex-column" id="content-wrapper">
          <div id="content" style={{ paddingTop: "80px" }}>
            <div className="container-fluid">
              <h3 className="text-dark mb-4">Cereri Produse</h3>
              <div className="card shadow" style={{ marginBottom: "10px" }}>
                <div className="card-header py-3">
                  <p className="text-primary m-0 font-weight-bold">
                    Adauga o cerere
                  </p>
                </div>
                <form onSubmit={addRequest}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <label className="col-form-label">Nume</label>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          value={requestName}
                          onChange={(e) => setRequestName(e.target.value)}
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
                          value={requestQty}
                          onChange={(e) => setRequestQty(e.target.value)}
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
                          value={requestAddress}
                          onChange={(e) => setRequestAddress(e.target.value)}
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
                      Toate Cererile
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
                            <th>Beneficiar</th>
                            <th>Nume</th>
                            <th>Cantitate</th>
                            <th>Adresa de preluare</th>
                            <th>Doneaza</th>
                          </tr>
                        </thead>
                        <tbody>{generalRequests}</tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              <div className="card shadow" style={{ marginTop: "10px" }}>
                <div className="card-header py-3">
                  <p className="text-primary m-0 font-weight-bold">
                    {isAdmin() ? "Toate Cererile" : "Cererile Mele"}
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
                          <th>Beneficiar</th>
                          <th>Nume</th>
                          <th>Cantitate</th>
                          <th>Adresa de preluare</th>
                          <th>Modifica Produs</th>
                          <th>Sterge produse</th>
                        </tr>
                      </thead>
                      <tbody>{personalRequests}</tbody>
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

const Request = ({ name, qty, location, id, user }) => {
  const [productName, setProductName] = useState(name);
  const [productQty, setProductQty] = useState(qty);
  const [productLocation, setProductLocation] = useState(location);
  const [productId, setProductId] = useState(id);

  const { userJwt } = useAuth();

  const navigate = useNavigate();

  const modifyRequest = (event) => {
    const product = {
      id: productId,
      nume: productName,
      cantitate: productQty,
      adresa: productLocation,
      userJwt,
    };

    axios.put(`${API_URL}/request`, product).then((res) => {
      navigate("/requests");
    });
  };

  const deleteRequest = (event) => {
    const product = {
      id: productId,
      userJwt,
    };

    axios.delete(`${API_URL}/request`, { data: product }).then((res) => {
      navigate("/requests");
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
          value={productLocation}
          onChange={(e) => setProductLocation(e.target.value)}
        />
      </td>
      <td>
        <button
          className="btn btn-warning"
          type="button"
          onClick={modifyRequest}
        >
          Modifica
        </button>
      </td>
      <td>
        <button
          className="btn btn-danger"
          type="button"
          onClick={deleteRequest}
        >
          Sterge
        </button>
      </td>
    </tr>
  );
};

const GeneralRequest = ({ name, qty, location, user_id, id, user }) => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const makeRequest = (event) => {
    const history = {
      id_product: id,
      name: name,
      cantitate: qty,
      beneficiar: user_id,
      user_id: currentUser?.user_id,
    };

    axios.post(`${API_URL}/historybeneficiar`, history).then((res) => {
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
      <td>{location}</td>
      <td>
        <button className="btn btn-primary" type="button" onClick={makeRequest}>
          Doneaza
        </button>
      </td>
    </tr>
  );
};

export default Requests;
