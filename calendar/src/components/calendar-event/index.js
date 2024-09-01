import React, { Component } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import "./addEvent.css";

async function addEvent(event) {
  try {
    const requiredFields = [
      "title",
      "location",
      "start_time",
      "end_time",
      "all_day",
      "reminder_time",
      "description",
    ];
    for (const field of requiredFields) {
      if (!event[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const events = await axios.get("http://localhost:8080/calendar-event");
    events.data.push(event);

    await axios.put("http://localhost:8080/calendar-event", events.data);
    console.log(`Successfully added event: ${event.title}`);
  } catch (err) {
    console.error(err);
  }
}

const AddEvent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.querySelector(".calendar-event-error").hidden = true;

    const user_id = window.localStorage.getItem("id");
    if (user_id == null) {
      return;
    }

    const new_event_data = {
      title: e.target.title.value,
      location: e.target.location.value,
      start_time: e.target.start.value,
      end_time: e.target.end.value,
      all_day: e.target.allday.checked,
      reminder_time: e.target.reminder.value,
      description: e.target.description.value,
      user_id,
    };

    if (!new_event_data.title) {
      document.querySelector(".calendar-event-error").hidden = false;
      return;
    }

    const response = await fetch("http://localhost:8080/calendar-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_event_data),
    });

    if (response.status === 201) {
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  const buildStartDate = (dateString) => {
    let date;
    if (dateString) {
      date = new Date(dateString);
    } else {
      date = new Date();
    }
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const buildEndDate = (dateString) => {
    let date;
    if (dateString) {
      date = new Date(dateString);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      return date.toISOString().slice(0, 16);
    }

    date = new Date();
    date.setMinutes(date.getMinutes() + 15 - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="add-event">
      <h1 className="create-title">Create Event</h1>
      <form className="event-form" onSubmit={handleSubmit}>
        <div hidden className="calendar-event-error">
          Title is required
        </div>
        <input
          type="text"
          className="event-title"
          placeholder="Title"
          name="title"
        />{" "}
        <br />
        <input
          type="text"
          className="event-location"
          placeholder="Location"
          name="location"
        />{" "}
        <br />
        <label className="start-label" htmlFor="start-time">
          Start:
        </label>{" "}
        <label className="end-label" htmlFor="end-time">
          End:
        </label>{" "}
        <br />
        <input
          id="start-time"
          type="datetime-local"
          className="event-start"
          name="start"
          defaultValue={buildStartDate(location.state?.start)}
        />
        <input
          id="end-time"
          type="datetime-local"
          className="event-end"
          name="end"
          defaultValue={buildEndDate(location.state?.end)}
        />
        <input
          id="all-day"
          type="checkbox"
          className="all-day"
          name="allday"
          value="0"
        />
        <label className="all-day-label" htmlFor="all-day">
          All Day
        </label>
        <label className="reminder-time">
          Remind at
          <input
            type="datetime-local"
            className="event-reminder"
            name="reminder"
          />
        </label>
        <br />
        <textarea
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
        <button className="button event-cancel" onClick={handleCancel}>
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

export default AddEvent;
