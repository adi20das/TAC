import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import NotFound from "./components/NotFound";
import Calendar from "./components/calendar/Calendar";
import AddEvent from "./components/calendar-event";
import UpdateEvent from "./components/calendar-event/edit-event";
import EventList from "./components/savedList";
import Login from "./components/login";
import SignUp from "./components/signup";
import ForgotPassword from "./components/password/forgotPassword";
import ContactUs from "./components/contact-us";
import Settings from "./components/settings";
import ChangePassword from "./components/password/change-password";
import ResetPassword from "./components/password/resetPassword";
import ChangeApi from "./components/settings/change_api";
import HistoricalEvents from "./components/historical-events";
import SavedList from "./components/savedList";
import SavedLists from "./components/savedLists";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Calendar />,
      },
      {
        path: "calendar-event/new",
        element: <AddEvent />,
      },
      {
        path: "calendar-event/edit/:id",
        element: <UpdateEvent />,
      },
      {
        path: "saved-lists/:id",
        element: <SavedList />,
      },
      {
        path: "saved-lists",
        element: <SavedLists />,
      },
      {
        path: "contact-us",
        element: <ContactUs />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "change-api",
        element: <ChangeApi />,
      },
      {
        path: "historical-events",
        element: <HistoricalEvents />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset/:token",
    element: <ResetPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
