import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import moment from "moment";
import Year from "./Year";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const localizer = momentLocalizer(moment); // or globalizeLocalizer
localizer.formats.yearHeaderFormat = "YYYY";

const Calendar = () => {
  const navigate = useNavigate();
  const clickRef = useRef(null);
  const [selectedDate] = useState();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const user_id = window.localStorage.getItem("id");
      const response = await axios.get(
        `http://localhost:8080/calendar-events?userId=${user_id}`
      );
      console.log(response.data.events);
      const events = response.data.events.map((event) => {
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        return event;
      });
      setEvents(events);
    }
    fetchData();
  }, []);

  const onSelectEvent = (event) => {
    navigate(`/calendar-event/edit/${event.id}`);
  };

  const onSelectSlot = useCallback((slotInfo) => {
    // This is use to handle click and double click  firing at the same time
    // See https://jquense.github.io/react-big-calendar/examples/index.html?path=/docs/props--on-select-slot
    clearTimeout(clickRef?.current);
    clickRef.current = setTimeout(() => {
      console.log(slotInfo);
      navigate("/calendar-event/new", {
        state: {
          start: slotInfo.start,
          end: slotInfo.end,
        },
      });
    }, 250);
  }, []);

  return (
    <div className="calendar">
      <BigCalendar
        localizer={localizer}
        events={events}
        showMultiDayTimes
        selectable={true}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        toolbar={true}
        views={{
          day: true,
          week: true,
          month: true,
          year: Year,
        }}
        messages={{ year: "Year" }}
      />
    </div>
  );
};

export default Calendar;
