import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

import "./settings.css";

const Settings = () => {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteAccount = async () => {
    const userId = window.localStorage.getItem("id");

    const response = await axios.delete(
      `http://localhost:8080/users/${userId}`
    );

    if (response.status === 200) {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("id");
      navigate("/login");
    }
  };

  return (
    <>
      <div className="container-settings">
        <h2 className="header-text">Settings</h2>
        <div className="row">
          <div className="col-8 offset-1">
            <div className="settings-list">
              <Link to="/change-password">Change Password</Link>
              <Link to="/change-api">Change Historial Events API</Link>
              <button type="button" onClick={() => setShowDeleteModal(true)}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this event?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAccount}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Settings;
