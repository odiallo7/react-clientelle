import React, { useState, useContext } from "react";
import axios from "axios";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Gestion des champs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion du Submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError("Le nom d'utilisateur ou le compte n'existe pas !");
    }
  };

  return (
    <>
      <h1>Connexion à l'application</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Adresse Email</label>
          <input
            onChange={handleChange}
            value={credentials.username}
            type="email"
            placeholder="Adresse Email..."
            name="username"
            id="username"
            className={"form-control" + (error && " is-invalid")}
          />
        </div>

        {error && <div className="invalid-feedback">{error}</div>}

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            onChange={handleChange}
            value={credentials.password}
            type="password"
            className="form-control"
            placeholder="Mot de passe..."
            name="password"
            id="password"
          />
        </div>
        <div className="from-group">
          <button type="submit" className="btn btn-success">
            Je me connecte !
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
