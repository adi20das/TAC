import "./event.css";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteEvent from "./deleteEvent";

const EditEvent = () => {
  const { id } = useParams();
  const [calendarEvent, setCalendarEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const eventData = await axios.get(
        `http://localhost:8080/calendar-event/${id}`
      );
      setCalendarEvent(eventData.data);
      const userId = window.localStorage.getItem("id");
      if (eventData.data?.userId !== userId) {
        navigate("/");
      }
    }
    fetchData();
  }, []);

  const buildLocalDateString = (dateString) => {
    if (!dateString) return;

    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.querySelector(".calendar-event-error").hidden = true;

    const new_event_data = {
      id,
      userId: window.localStorage.getItem("id"), // TODO: this is obviously very bad, we should use a session cookie or something similar instead
      title: e.target.title.value,
      location: e.target.location.value,
      startTime: e.target.start.value,
      endTime: e.target.end.value,
      allDay: e.target.allday.checked,
      reminderTime: e.target.reminder.value,
      description: e.target.description.value,
    };

    if (!new_event_data.title) {
      document.querySelector(".calendar-event-error").hidden = false;
      return;
    }

    const response = await (
      await fetch("http://localhost:8080/calendar-event", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_event_data),
      })
    ).json();

    if (response.status === "ok") {
      navigate("/");
    }
  };

  const handleDelete = async () => {
    if (!id) {
      // This should never happen but just in case return early if there is no id
      return;
    }
    await fetch(`http://localhost:8080/calendar-event/${id}`, {
      method: "DELETE",
    });
    console.log("delete called");
    navigate("/");
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="update-event">
      <h1 className="create-title">Update Event</h1>

      <form className="event-form" onSubmit={handleSubmit}>
        <div hidden className="calendar-event-error">
          Title is required
        </div>
        <input
          defaultValue={calendarEvent?.title}
          type="text"
          className="event-title"
          placeholder="Title"
          name="title"
        />{" "}
        <br />
        <input
          defaultValue={calendarEvent?.location}
          type="text"
          className="event-location"
          placeholder="Location"
          name="location"
        />{" "}
        <br />
        <label className="start-label">Start:</label>{" "}
        <label className="end-label">End:</label> <br />
        <input
          defaultValue={buildLocalDateString(calendarEvent?.startTime)}
          type="datetime-local"
          className="event-start"
          name="start"
        />
        <input
          defaultValue={buildLocalDateString(calendarEvent?.endTime)}
          type="datetime-local"
          className="event-end"
          name="end"
        />
        <input
          defaultValue={calendarEvent?.allDay}
          type="checkbox"
          className="all-day"
          name="allday"
        />
        <label className="all-day-label">All Day</label>
        <label className="reminder-time">
          Remind at
          <input
            defaultValue={buildLocalDateString(calendarEvent?.reminderTime)}
            type="datetime-local"
            className="event-reminder"
            name="reminder"
          />
        </label>
        <br />
        <textarea
          defaultValue={calendarEvent?.description}
          className="event-description"
          placeholder="Description"
          name="description"
        />{" "}
        <br />
        <button className="button event-save" type="submit">
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M29.475 4.5H6.525C5.40662 4.5 4.5 5.40662 4.5 6.525V29.475C4.5 30.5934 5.40662 31.5 6.525 31.5H29.475C30.5934 31.5 31.5 30.5934 31.5 29.475V6.525C31.5 5.40662 30.5934 4.5 29.475 4.5Z"
              stroke="black"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M24 4.5V18H11.25V4.5H24Z"
              stroke="black"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M19.5 9.75V12.75"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8.24805 4.5H26.9992"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Save
        </button>
        <DeleteEvent handleDelete={handleDelete} />
        <button
          type="button"
          className="button event-cancel"
          onClick={handleCancel}
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 33C26.2843 33 33 26.2843 33 18C33 9.71573 26.2843 3 18 3C9.71573 3 3 9.71573 3 18C3 26.2843 9.71573 33 18 33Z"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24.75 11.25L11.25 24.75"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.25 11.25L24.75 24.75"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
