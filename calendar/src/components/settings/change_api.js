import React, { Component } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GreyBackround from "../grayBackground";
import "./api.css";

const ChangeApi = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/settings");
  };

  return (
    <>
      <GreyBackround />
      <div className="change-api">
        <b>
          <h2 className="change-title">
            Select source to use for historical events
          </h2>
        </b>
        <h3 className="change-desc">
          <b>
            Some sources result in charges, and thus require a subscription to
            be purchased first
          </b>
        </h3>
        <h3 className="free-api">Free: </h3>
        <input
          id="new-york-times"
          type="checkbox"
          className="NYT"
          name="new-york-times"
          value="1"
          checked
          disabled
        />
        <label className="nyt-label" for="new-york-times">
          New York times - Default
        </label>
        <br />
        <input
          id="wikipedia"
          type="checkbox"
          className="Wikipedia"
          name="wikipedia"
          value="0"
          disabled
        />
        <label className="wikipedia-label" for="wikipedia">
          Wikipedia {"(Coming Soon)"}
        </label>
        <br />
        <h3 className="subscription-api">Subscription required: </h3>
        <input
          id="running-joke"
          type="checkbox"
          className="the-boys"
          name="running-joke"
          value="0"
          disabled
        />
        <label className="the-boys-label" for="running-joke">
          The Boys {"(Coming Soon)"}
        </label>
        <br />
        <input
          id="bean-soup"
          type="checkbox"
          className="coffee"
          name="bean-soup"
          value="0"
          disabled
        />
        <label className="coffee-label" for="bean-soup">
          Coffee Beans {"(Coming Soon)"}
        </label>
        <br />
        <input
          id="quaso"
          type="checkbox"
          className="croissant"
          name="quaso"
          value="0"
          disabled
        />
        <label className="quaso" for="quaso">
          Quaso {"(Coming Soon)"}
        </label>
        <br />
        <br />
        <button className="button event-save" type="submit" disabled>
          Save
        </button>
        <button className="button event-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </>
  );
};

export default ChangeApi;
