import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import { API_URL } from '../const';

import '../assets/css/style.css';

const Register = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [repeatpassword, setRepeatpassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const user = {
            fname : fname,
            lname : lname,
            email : email,
            address : address,
            phone : phone,
            password : password,
            repeatpassword: repeatpassword
        };

        axios.post(`${API_URL}/register`, user)
        .then(res => {
            console.log(res);
            console.log(res.data);
            
            if (res.data.register) {
                navigate("/");
            }
        })
    }

    return (
        <div>
            <div className="container">
                <div className="card shadow-lg o-hidden border-0 my-5">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col-lg-5 d-none d-lg-flex">
                                <div className="flex-grow-1 bg-register-image image-login"></div>
                            </div>
                            <div className="col-lg-7">
                                <div className="p-5">
                                    <div className="text-center">
                                        <h4 className="text-dark mb-4">Create an Account!</h4>
                                    </div>
                                    <form className="user" onSubmit={handleSubmit}>
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3 mb-sm-0"><input className="form-control form-control-user" type="text" id="exampleFirstName" placeholder="First Name" name="first_name" value={fname} onChange={(e) => setFname(e.target.value)}/></div>
                                            <div className="col-sm-6"><input className="form-control form-control-user" type="text" id="exampleFirstName" placeholder="Last Name" name="last_name" value={lname} onChange={(e) => setLname(e.target.value)}/></div>
                                        </div>
                                        <div className="form-group"><input className="form-control form-control-user" type="email" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Email Address" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/></div>
                                        <div className="form-group"><input className="form-control form-control-user" type="text" aria-describedby="emailHelp" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)}/></div>
                                        <div className="form-group"><input className="form-control form-control-user" type="text" aria-describedby="emailHelp" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}/></div>
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3 mb-sm-0"><input className="form-control form-control-user" type="password" id="examplePasswordInput" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/></div>
                                            <div className="col-sm-6"><input className="form-control form-control-user" type="password" id="exampleRepeatPasswordInput" placeholder="Repeat Password" name="password_repeat" value={repeatpassword} onChange={(e) => setRepeatpassword(e.target.value)}/></div>
                                        </div><button className="btn btn-primary btn-block text-white btn-user" type="submit">Register Account</button>
                                        <hr/>
                                    </form>
                                    <div className="text-center"><Link className="small" to="http://localhost:3000/">Already have an account? Login!</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Register;