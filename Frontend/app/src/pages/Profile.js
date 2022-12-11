import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import Nav from "./Nav";
import Footer from "./Footer";
import { API_URL } from "../const";
import { useAuth } from "../AuthContext";
import Avatar from "./Avatar";

import "../assets/css/style.css";
import "../assets/bootstrap/css/bootstrap.min.css";
import "../assets/fonts/fontawesome-all.min.css";

const Profile = () => {
  const [beneficiaryHistory, setBeneficiaryHistory] = useState([]);
  const [donatorHistory, setDonatorHistory] = useState([]);

  const {currentUser} = useAuth();

  useEffect(() => {
    const user = {
      user_id: currentUser?.user_id,
    };

    axios.post(`${API_URL}/gethistorydonator`, user).then((res) => {
      const beneficiaryHistoryItems = [];
      let hist = res.data.history;
      for (let i = 0; i < hist.length; i++) {
        beneficiaryHistoryItems.push(
          <History
          key={i}
            p={hist[i].name}
            c={hist[i].cantitate}
            d={hist[i].donator}
          />
        );
      }
      setBeneficiaryHistory(beneficiaryHistoryItems);
    });

    axios
      .post(`${API_URL}/gethistorybeneficiary`, user)
      .then((res) => {
        const donatorHistory = [];
        let hist = res.data.history;
        for (let i = 0; i < hist.length; i++) {
          donatorHistory.push(
            <History
            key={i}
              p={hist[i].name}
              c={hist[i].cantitate}
              d={hist[i].beneficiar}
            />
          );
        }
        setDonatorHistory(donatorHistory);
      });
  }, []);

  return (
    <div>
      <div id="wrapper">
        <Nav />
        <div className="d-flex flex-column" id="content-wrapper">
          <div id="content" style={{paddingTop: '80px'}}>
            <div className="container-fluid">
              <h3 className="text-dark mb-4">Profil</h3>
              <div className="row mb-3">
                <div className="col-lg-4">
                  <div className="card mb-3">
                    <div className="card-body text-center shadow">
                      <Avatar user={currentUser} size="100" />
                      <div className="mb-3">
                        <h3 className="mt-3">
                          {currentUser.username}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8">
                  <div className="row">
                    <div className="col">
                      <div className="card shadow">
                        <div className="card-header py-3">
                          <p className="text-primary m-0 font-weight-bold">
                            Istoric Beneficiar
                          </p>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col">
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Produs</th>
                                      <th>Cantitate</th>
                                      <th>Donator</th>
                                    </tr>
                                  </thead>
                                  <tbody>{beneficiaryHistory}</tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card shadow" style={{ marginTop: "30px" }}>
                        <div className="card-header py-3">
                          <p className="text-primary m-0 font-weight-bold">
                            Istoric Donator
                          </p>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col">
                              <div className="table-responsive">
                                <table className="table">
                                  <thead>
                                    <tr>
                                      <th>Produs</th>
                                      <th>Cantitate</th>
                                      <th>Beneficiar</th>
                                    </tr>
                                  </thead>
                                  <tbody>{donatorHistory}</tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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

const History = ({ p, c, d }) => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        axios.post(`${API_URL}/user`, {user_id: d}).then(({data: user}) => {
            setUserData(user.user);
        })
    }, [d])
  return (
    <tr>
      <td>{p}</td>
      <td>{c}</td>
      <td>{userData && (<><Avatar user={userData} />&nbsp;&nbsp;{userData.username}</>)}</td>
    </tr>
  );
};

export default Profile;
