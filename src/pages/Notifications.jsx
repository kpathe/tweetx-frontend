import React, { useEffect, useState } from "react";
import { Heart, User, MessageCircle } from "lucide-react";
import userService from "../services/user.service";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await userService.getNotifications();
        if (response.success) {
          setNotifications(response.data);
        }
      } catch (err) {
        console.error("Notifications :: Error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5" style={{ color: "#f91880", fill: "#f91880" }} />;
      case "follow":
        return <User className="w-5 h-5" style={{ color: "var(--accent-color)" }} />;
      case "reply":
        return <MessageCircle className="w-5 h-5" style={{ color: "var(--accent-color)" }} />;
      default:
        return null;
    }
  };

  const getMessage = (notif) => {
    switch (notif.type) {
      case "like":
        return "liked your tweet";
      case "follow":
        return "followed you";
      case "reply":
        return `replied to your tweet: "${notif.tweet?.content?.substring(0, 30)}..."`;
      default:
        return "interacted with you";
    }
  };

  const handleNotificationClick = async (notifId, isRead) => {
    if (!isRead) {
      try {
        await userService.markNotificationAsRead(notifId);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n)),
        );
      } catch (error) {
        console.error("Notifications :: Error marking as read", error);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div
        className="px-4 py-3 sticky top-0 z-10 flex items-center justify-between"
        style={{
          borderBottom: "1px solid var(--border-color)",
          backgroundColor: "var(--bg-primary)",
        }}
      >
        <h1 className="text-xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Notifications
        </h1>
        <button
          className="px-3 py-1 rounded-full text-sm font-bold transition-opacity hover:opacity-80"
          style={{ color: "var(--accent-color)" }}
        >
          Settings
        </button>
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="p-8 space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: "var(--bg-secondary)" }} />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 rounded w-1/2" style={{ backgroundColor: "var(--bg-secondary)" }} />
                  <div className="h-3 rounded w-1/4" style={{ backgroundColor: "var(--bg-secondary)" }} />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif._id, notif.isRead)}
              className="px-4 py-3 flex gap-3 cursor-pointer transition-colors relative"
              style={{
                borderBottom: "1px solid var(--border-color)",
                backgroundColor: !notif.isRead ? "rgba(29,155,240,0.03)" : "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-secondary)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = !notif.isRead ? "rgba(29,155,240,0.03)" : "transparent"}
            >
              {!notif.isRead && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: "var(--accent-color)" }}
                />
              )}
              <div className="pt-1 flex-shrink-0">{getIcon(notif.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/u/${notif.sender?.username}`}
                    className="flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {notif.sender?.profileImage ? (
                      <img
                        src={notif.sender.profileImage}
                        className="w-8 h-8 rounded-full object-cover"
                        alt={notif.sender?.username}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--accent-color)" }}
                      >
                        {notif.sender?.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to={`/u/${notif.sender?.username}`}
                      className="font-bold text-[15px] hover:underline"
                      style={{ color: "var(--text-primary)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {notif.sender?.fullName}
                    </Link>
                  </div>
                </div>
                <p className="text-[15px] mt-1" style={{ color: "var(--text-primary)" }}>
                  {getMessage(notif)}
                </p>
                <p className="text-[13px] mt-0.5" style={{ color: "var(--text-secondary)" }}>
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
                {(notif.type === "like" || notif.type === "reply") && notif.tweet && (
                  <Link
                    to={`/tweet/${notif.tweet._id}`}
                    className="mt-2 p-3 rounded-xl block text-[14px] transition-colors"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p className="line-clamp-2">{notif.tweet.content}</p>
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-16 text-center max-w-sm mx-auto">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <Heart className="w-8 h-8" style={{ color: "var(--accent-color)", opacity: 0.5 }} />
            </div>
            <h3 className="text-2xl font-extrabold mb-1" style={{ color: "var(--text-primary)" }}>
              No notifications yet
            </h3>
            <p className="text-[15px]" style={{ color: "var(--text-secondary)" }}>
              When people interact with you or your posts, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;