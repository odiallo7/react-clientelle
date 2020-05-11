import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import axios from "axios";
import CustomersAPI from "../services/CustomersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [error, setError] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);

  // Recupération du Customer en fonction de l'identifiant
  const fetchCustomer = async (id) => {
    try {
      const {
        firstName,
        lastName,
        email,
        company,
      } = await CustomersAPI.findOne(id);
      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      //TODO
      history.replace("/customers");
    }
  };

  // Chargement du Customer si besoin au chargement du composant ou au changement de l'identifiant
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await CustomersAPI.update(id, customer);
      } else {
        await CustomersAPI.create(customer);
        history.replace("/customers");
      }
      setError({});
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setError(apiErrors);
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un Client !</h1>) || (
        <h1>Modification d'un client</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom"
          placeholder="Nom de famille du client"
          value={customer.lastName}
          onChange={handleChange}
          error={error.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Prénom du client"
          value={customer.firstName}
          onChange={handleChange}
          error={error.firstName}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="Adresse email du client"
          value={customer.email}
          onChange={handleChange}
          error={error.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="L'entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={error.company}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregister{" "}
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
