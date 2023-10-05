import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import Footer from "./components/Footer";


// get the logged in user from the backend and pass it to App.js
axios.get(`/api/auth/loggedin`).then((response) => {
  console.log("logged in user: ", response.data);
  const user = response.data;
  ReactDOM.render(
    <Router>
      <App user={user} />
      <Footer />
    </Router>,
    document.getElementById("root")
  );
});
