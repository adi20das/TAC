import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/sidebar";
import axios from "axios";

function sendNotification(text) {
  new Notification(text);
}

function addReminder(event, time) {
  const startTime = new Date(event.startTime);
  const startHours = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const text = `Upcoming event: ${event.title} - ${startHours}::${startMinutes}`;
  setTimeout(sendNotification(text), time);
}

async function checkReminders() {
  const userId = window.localStorage.getItem("id");
  const events = (
    await axios.get(
      `http://localhost:8080/calendar-events/upcoming?userId=${userId}`
    )
  ).data;

  for (const event of events) {
    const currentTime = new Date().getTime();
    const reminderTime = new Date(event.reminderTime).getTime();

    if (reminderTime > currentTime)
      addReminder(event, reminderTime - currentTime);
  }
}

async function getNotificationPermission() {
  if (
    Notification.permission !== "granted" &&
    Notification.permission !== "denied"
  ) {
    await Notification.requestPermission();
  }
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page if not logged in
    if (window.localStorage.getItem("id") === null) {
      navigate("/login");
      return;
    }
    getNotificationPermission();
    checkReminders();
    // Check for upcoming reminders every minute (60000 milliseconds)
    setInterval(checkReminders, 60000);
  }, []);

  return (
    <div className="App">
      <Sidebar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <Outlet />
    </div>
  );
}

export default App;
