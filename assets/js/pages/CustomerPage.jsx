import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import CustomersAPI from "../services/CustomersAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);

  const [loading, setLoading] = useState(false);

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
      setLoading(false);
    } catch (error) {
      toast.error("Une erreur est survenue lors du chargement du client ⛔");
      history.replace("/customers");
    }
  };

  // Chargement du Customer si besoin au chargement du composant ou au changement de l'identifiant
  useEffect(() => {
    if (id !== "new") {
      setLoading(true);
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
      setErrors({});
      if (editing) {
        CustomersAPI.update(id, customer);
        toast.success("Le client a bien été modifiée");
      } else {
        await CustomersAPI.create(customer);
        toast.success("Le client a bien été créé");
        history.replace("/customers");
      }
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });

        setErrors(apiErrors);
        toast.error("Des erreurs sont survenues dans le formulaire ⛔");
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un Client !</h1>) || (
        <h1>Modification d'un client</h1>
      )}

      {loading && <FormContentLoader />}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="lastName"
            label="Nom"
            placeholder="Nom de famille du client"
            value={customer.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
          <Field
            name="firstName"
            label="Prénom"
            placeholder="Prénom du client"
            value={customer.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Field
            name="email"
            label="Email"
            type="email"
            placeholder="Adresse email du client"
            value={customer.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="company"
            label="Entreprise"
            placeholder="L'entreprise du client"
            value={customer.company}
            onChange={handleChange}
            error={errors.company}
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
      )}
    </>
  );
};

export default CustomerPage;
