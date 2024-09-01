import "./savedList.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
//import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import GrayBackground from "../grayBackground";
import PinIcon from "./pinIcon";

//Bootstrap needed

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    className="dropdown"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    <span className="threedots" />
  </button>
));

const SavedList = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [savedLists, setSavedList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const id = window.localStorage.getItem("id");

      const savedLists = await axios.get(
        `http://localhost:8080/saved-lists?userId=${id}`
      );
      setSavedList(savedLists.data);
    }
    fetchData();
  }, []);

  const DeleteList = (vara) => {
    //console.log(vara);

    const userId = window.localStorage.getItem("id");
    axios.delete(`http://localhost:8080/saved-lists/${vara}?userId=${userId}`);
    window.location.reload(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toDateString();
  };

  const newList = async () => {
    const listName = document.querySelector("#new-saved-list-name").value;
    const user_id = window.localStorage.getItem("id");
    if (user_id == null) {
      return;
    }

    const list = await axios.post("http://localhost:8080/saved-lists", {
      user_id,
      title: listName,
    });
    console.log(list);
    window.location.reload(false);
  };

  const searchLists = async (e) => {
    e.preventDefault();
    const query = e.target.query.value;
    const id = window.localStorage.getItem("id");

    const savedLists = await axios.get(
      `http://localhost:8080/saved-lists?userId=${id}&q=${encodeURIComponent(
        query
      )}`
    );
    setSavedList(savedLists.data);
  };

  return (
    <div className="saved-list">
      <GrayBackground />
      <div className="searchBox">
        <form id="search-lists-form" onSubmit={searchLists}>
          <input type="text" name="query" placeholder="Search.."></input>
        </form>
      </div>
      <i className="fa-solid fa-magnifying-glass"></i>
      <div>
        <button className="unstyled-button" onClick={handleShow}>
          <i class="fa-solid fa-plus"></i>
          New Saved List
        </button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a new list</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label for="new-saved-list-name">Name:</label>
            <input id="new-saved-list-name"></input>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="success" onClick={newList}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="mainTitle">
        <h1>My Saved Lists</h1>
      </div>
      <div>
        {savedLists.map((list, index) => (
          <div className="box" key={index}>
            <div className="menu">
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle} />
                <Dropdown.Menu size="sm" title="">
                  <Dropdown.Item onClick={() => DeleteList(list.id)}>
                    <Button variant="danger">
                      <div>
                        <i className="fa fa-trash"></i> Delete
                      </div>
                    </Button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="pinIcon">
              <PinIcon />
            </div>
            <div className="list">
              <div className="list-title">
                <Link to={list.id}>
                  <h3>{list ? list.title : "Loading"}</h3>
                </Link>
              </div>
              <div className="list-events">
                <ul>
                  {list.historicalEvents
                    .slice(0, 2)
                    .map((historicalEvent, index) => (
                      <li key={index}>
                        {formatDate(historicalEvent.date)}
                        {" - "}
                        {historicalEvent.title.length > 50
                          ? historicalEvent.title.slice(0, 50) + "..."
                          : historicalEvent.title}{" "}
                        (
                        <a
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          href={historicalEvent.url}
                        >
                          Read more
                        </a>
                        )
                      </li>
                    ))}
                </ul>
                <div>
                  {list.historicalEvents.length > 2
                    ? list.historicalEvents.length + " Items"
                    : ""}
                  {list.historicalEvents.length === 0 ? "No Items" : ""}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="no-lists-message">
          {savedLists.length === 0 ? (
            <>
              No lists found <br /> Note: Check search term
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedList;
