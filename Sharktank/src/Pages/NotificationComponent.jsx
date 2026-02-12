import React, { useState } from "react";

  const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, icon: "bi-envelope", message: "Lisa sent you a mail", time: "2 min ago", color: "text-primary" },
    { id: 2, icon: "bi-exclamation-triangle", message: "Mail server not working", time: "5 min ago", color: "text-warning" },
    { id: 3, icon: "bi-cash", message: "Transaction complete", time: "2 days ago", color: "text-success" },
  ]);

  return (
    <li className="dropdown">
      <a
        className="app-nav__item"
        href="#"
        data-bs-toggle="dropdown"
        aria-label="Show notifications"
      >
        <i className="bi bi-bell fs-5" />
      </a>
      <ul className="app-notification dropdown-menu dropdown-menu-right">
        <li className="app-notification__title">
          You have {notifications.length} new notifications.
        </li>
        <div className="app-notification__content">
          {notifications.map((notif) => (
            <li key={notif.id}>
              <a className="app-notification__item" href="#">
                <span className="app-notification__icon">
                  <i className={`bi ${notif.icon} fs-4 ${notif.color}`} />
                </span>
                <div>
                  <p className="app-notification__message">{notif.message}</p>
                  <p className="app-notification__meta">{notif.time}</p>
                </div>
              </a>
            </li>
          ))}
        </div>
        <li className="app-notification__footer">
          <a href="#">See all notifications.</a>
        </li>
      </ul>
    </li>
  );
};

export default NotificationComponent;
