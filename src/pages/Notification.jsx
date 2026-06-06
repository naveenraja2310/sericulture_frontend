import React, { useEffect, useState } from "react";
import { getNotifications } from "../api/notificationApi";
import { getStoredDeviceId } from "../utils/auth";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const deviceId = getStoredDeviceId();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getNotifications({ page, limit, deviceId });
        const list = res?.data?.notification || [];
        const total = res?.data?.total_count || 0;
        if (!mounted) return;
        setNotifications(list);
        setTotalCount(total);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, [page, limit, deviceId]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  const formatTime = (n) => {
    const raw = n.createdAt || n.timestamp;
    if (!raw) return "—";
    const date = new Date(raw);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1)    return "Just now";
    if (diffMins < 60)   return `${diffMins}m ago`;
    if (diffHours < 24)  return `${diffHours}h ago`;
    if (diffDays < 7)    return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const fullTime = (n) => {
    const raw = n.createdAt || n.timestamp;
    return raw ? new Date(raw).toLocaleString() : "—";
  };

  return (
    <div className="notif-page">
      {loading ? (
        <div className="loader-container" style={{ height: 200 }}>
          <div className="loader" />
          <p className="loader-text">Loading notifications…</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>

          {notifications.length === 0 ? (
            <div className="notif-empty">
              <i className="ti ti-bell-off" aria-hidden="true" />
              <p>No notifications yet</p>
              <span>You're all caught up!</span>
            </div>
          ) : (
            <ul className="notif-list">
              {notifications.map((n, idx) => (
                <li key={n.id ?? idx} className="notif-item">
                  <div className="notif-icon-wrap">
                    <i className="ti ti-bell-ringing" aria-hidden="true" />
                  </div>
                  <div className="notif-content">
                    <div className="notif-title">{n.title}</div>
                    <div className="notif-body">{n.body}</div>
                  </div>
                  <div className="notif-time" title={fullTime(n)}>
                    {formatTime(n)}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="users-pagination">
            <span className="users-count">
              {totalCount} notification{totalCount !== 1 ? "s" : ""} total
            </span>
            <div className="users-page-controls">
              <button
                className="users-page-btn"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <i className="ti ti-chevron-left" aria-hidden="true" />
              </button>
              <span className="users-page-label">
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>
              <button
                className="users-page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <i className="ti ti-chevron-right" aria-hidden="true" />
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Notification;