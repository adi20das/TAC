import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

import "./index.css";

const HistoricalEvents = () => {
  const [events, setEvents] = useState([]);
  const [saveActionEvent, setSaveActionEvent] = useState(null);
  const [savedLists, setSavedLists] = useState([]);
  const [modalShown, setModalShown] = useState(false);
  const BOX_COLORS = [
    "#E09958",
    "#ADD8E6",
    "#6BD087",
    "#AF73D3",
    "#DF3F3F",
    "#F4EE5F",
  ];

  const fetchEvents = async () => {
    const userId = window.localStorage.getItem("id");
    try {
      const events = await (
        await fetch(
          `http://localhost:8080/historical-events/random?userId=${userId}`
        )
      ).json();
      setEvents(events);
    } catch (error) {
      console.log("Error getting events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const randomizeEvents = async (e) => {
    e.target.disabled = true;
    await fetchEvents();
    const saveBtns = document.querySelectorAll(".save-btn");
    saveBtns.forEach((btn) => {
      btn.innerText = "Save";
      btn.disabled = false;
    });
    setTimeout(() => (e.target.disabled = false), 6000);
  };

  const fetchSavedLists = async () => {
    const id = window.localStorage.getItem("id");

    const savedLists = await (
      await fetch(`http://localhost:8080/saved-lists?userId=${id}`)
    ).json();
    setSavedLists(savedLists);
  };

  const openSavedListSelectionModal = async (e) => {
    setSaveActionEvent(e);
    await fetchSavedLists();
    setModalShown(true);
  };

  const closeSavedListSelectionModal = () => {
    setModalShown(false);
    document.querySelector("#save-event-error").hidden = true;
  };

  const addPreference = async (e) => {
    const userId = window.localStorage.getItem("id");
    const eventCategory = e.target.dataset["eventCategory"];

    if (!userId || !eventCategory) {
      // This should never happen but just in case return early
      return;
    }

    await fetch("http://localhost:8080/preferences/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventCategory,
        action: "add",
      }),
    });
  };

  const removePreference = async (e) => {
    const userId = window.localStorage.getItem("id");
    const eventCategory = e.target.dataset["eventCategory"];

    if (!userId || !eventCategory) {
      // This should never happen but just in case return early
      return;
    }

    await fetch("http://localhost:8080/preferences/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventCategory,
        action: "remove",
      }),
    });
  };

  const saveEvent = async (e) => {
    e.preventDefault();
    const userId = window.localStorage.getItem("id");
    const savedListId = e.target["saved-list"].value;
    const newSavedListName = e.target["new-saved-list"].value;
    const eventIndex = saveActionEvent.target.dataset["eventIndex"];
    const event = events[eventIndex];

    if (!event) {
      // This should never happen but just in case return early
      return;
    }

    const res = await fetch("http://localhost:8080/historical-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        userId,
        savedListId,
        newSavedListName,
      }),
    });

    if (res.status !== 200) {
      document.querySelector("#save-event-error").hidden = false;
      return;
    }

    saveActionEvent.target.innerText = "Saved";
    saveActionEvent.target.disabled = true;
    closeSavedListSelectionModal();
  };

  return (
    <>
      <div id="historical-events-header">
        <h1>Historical Events</h1>
        <button type="button" id="randomize-btn" onClick={randomizeEvents}>
          Randomize
        </button>
      </div>
      <div id="historical-event-cards">
        <Modal show={modalShown} onHide={closeSavedListSelectionModal}>
          <Modal.Header closeButton>
            <Modal.Title>Save Event</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form id="save-event-form" onSubmit={saveEvent}>
              <div hidden id="save-event-error">
                Error while saving. Please try again
              </div>
              <label htmlFor="saved-list">Select Saved List:</label>
              <select id="saved-list">
                {savedLists.map((list, index) => (
                  <option key={index} value={list.id}>
                    {list.title}
                  </option>
                ))}
              </select>
              <p>OR</p>
              <label>
                New Saved List:{" "}
                <input
                  type="text"
                  name="new-saved-list"
                  placeholder="List Name"
                ></input>
              </label>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeSavedListSelectionModal}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" form="save-event-form">
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        {events.map((event, index) => (
          <div
            className="event-card"
            style={{ backgroundColor: BOX_COLORS[index] }}
            key={index}
          >
            <button
              type="button"
              onClick={openSavedListSelectionModal}
              className="save-btn"
              data-event-index={index}
            >
              Save
            </button>
            {event.multimedia ? (
              <>
                <h2 className="title">{event.title}</h2>
                <img
                  src={`https://static01.nyt.com/${event.multimedia.url}`}
                  alt="event"
                ></img>
              </>
            ) : (
              <h1 className="title">{event.title}</h1>
            )}
            <h4 className="event-publish-date">Published: {event.pub_date}</h4>
            <p className="event-description">{event.description}</p>
            <a
              target="_blank"
              href={event.url}
              rel="noopener noreferrer nofollow"
              className="event-url"
            >
              Read more
            </a>
            <button
              type="button"
              data-event-category={event.category}
              className="interested-btn"
              onClick={addPreference}
            >
              Interested
            </button>
            <button
              type="button"
              data-event-category={event.category}
              className="not-interested-btn"
              onClick={removePreference}
            >
              Not Interested
            </button>
          </div>
        ))}
        <h1 className="loading-text" hidden={events.length > 0}>
          Loading...
        </h1>
      </div>
    </>
  );
};

export default HistoricalEvents;
