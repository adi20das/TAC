import "./savedList.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PinIcon from "./pinIcon";
import { Link, useParams } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import GrayBackground from "../grayBackground";
import { Button } from "react-bootstrap";

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
  const { id } = useParams();
  const userId = window.localStorage.getItem("id");
  const [savedList, setSavedList] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const savedList = await axios.get(
        `http://localhost:8080/saved-lists/${id}?userId=${userId}`
      );

      setSavedList(savedList.data);
      setSavedEvents(savedList.data.historicalEvents);
    }
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toDateString();
  };

  const DeleteEvent = (vara) => {
    //console.log(vara);
    axios.delete(`http://localhost:8080/historical-events/${vara}`);
    window.location.reload(false);
  };

  const searchList = (e) => {
    e.preventDefault();

    const query = e.target.query.value;
    const regex = new RegExp(`.*${query}.*`, "i");
    const filteredEvents = savedList.historicalEvents.filter((event) =>
      regex.test(event.title)
    );
    console.log({ filteredEvents });
    setSavedEvents(filteredEvents);
  };

  return (
    <div className="saved-list">
      <GrayBackground />
      <div className="searchBox">
        <form id="search-list-form" onSubmit={searchList}>
          <input type="text" name="query" placeholder="Search.."></input>
        </form>
      </div>
      <i className="fa-solid fa-magnifying-glass"></i>

      <div className="mainTitle">
        <Link className="back-btn" to="/saved-lists">
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </Link>
        <h1>{savedList ? savedList.title : "Loading"}</h1>
      </div>

      <div className="list-event">
        {savedEvents.length > 0 ? (
          savedEvents.map((historicalEvent, index) => (
            <div className="box" key={index}>
              <div className="menu">
                <Dropdown>
                  <Dropdown.Toggle as={CustomToggle} />
                  <Dropdown.Menu size="sm" title="">
                    <Dropdown.Item>
                      <i className="fa fa-folder"></i>Save to list
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => DeleteEvent(historicalEvent._id)}
                    >
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

              {historicalEvent ? (
                <div className="event-body">
                  <h4>{historicalEvent.title}</h4>
                  <h5 className="event-date">
                    {formatDate(historicalEvent.date)}
                  </h5>
                  <p>{historicalEvent.description}</p>
                  <a
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    href={historicalEvent.url}
                  >
                    Read more
                  </a>
                </div>
              ) : (
                "Loading"
              )}
            </div>
          ))
        ) : (
          <div className="no-lists-message">
            No saved events found <br /> Note: Check search term
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedList;
