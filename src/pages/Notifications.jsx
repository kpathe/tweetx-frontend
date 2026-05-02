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
        return <Heart className="text-pink-600 fill-pink-600 w-6 h-6" />;
      case "follow":
        return <User className="text-violet-600 fill-violet-600 w-6 h-6" />;
      case "reply":
        return <MessageCircle className="text-blue-500 w-6 h-6" />;
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
      <div className="p-4 border-b border-[var(--border-color)] sticky top-0 bg-[var(--bg-primary)] opacity-95 backdrop-blur-md z-10 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">
          Notifications
        </h1>
        <button className="text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 px-3 py-1 rounded-full text-sm font-bold transition-colors">
          Settings
        </button>
      </div>

      <div className="flex-1 divide-y divide-[var(--border-color)]">
        {loading ? (
          <div className="p-10 space-y-4">
            {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex gap-4 animate-pulse">
                 <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-full"></div>
                 <div className="flex-1 space-y-2 pt-2">
                    <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/2"></div>
                    <div className="h-3 bg-[var(--bg-secondary)] rounded w-1/4"></div>
                 </div>
               </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleNotificationClick(notif._id, notif.isRead)}
              className={`p-4 flex gap-4 hover:bg-[var(--bg-secondary)] transition-all cursor-pointer relative group ${
                !notif.isRead ? "bg-[var(--accent-color)]/5" : ""
              }`}
            >
              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--accent-color)]"></div>
              )}
              <div className="pt-1">{getIcon(notif.type)}</div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link to={`/u/${notif.sender?.username}`} className="hover:opacity-80 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      {notif.sender?.profileImage ? (
                        <img
                          src={notif.sender.profileImage}
                          className="w-10 h-10 rounded-full object-cover"
                          alt={notif.sender?.username}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-color)] font-bold">
                           {notif.sender?.username?.[0]?.toUpperCase()}
                        </div>
                      )}
                    </Link>
                    <div className="flex flex-col">
                      <Link to={`/u/${notif.sender?.username}`} className="font-bold text-[var(--text-primary)] hover:underline" onClick={(e) => e.stopPropagation()}>
                        {notif.sender?.fullName}
                      </Link>
                      <span className="text-[var(--text-secondary)] text-xs">
                        {formatDistanceToNow(new Date(notif.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-[var(--text-primary)] text-[15px] mt-2">
                  <span className="font-semibold">{notif.sender?.fullName}</span> {getMessage(notif)}
                </p>
                {(notif.type === "like" || notif.type === "reply") &&
                  notif.tweet && (
                    <Link
                      to={`/tweet/${notif.tweet._id}`}
                      className="mt-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[15px] text-[var(--text-secondary)] block hover:border-[var(--accent-color)]/50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="line-clamp-2">{notif.tweet.content}</p>
                    </Link>
                  )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center mx-auto mb-6">
               <Heart className="text-[var(--accent-color)] w-10 h-10 opacity-50" />
            </div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">No notifications yet</h3>
            <p className="text-[var(--text-secondary)]">When people interact with you or your posts, you'll see it here.</p>
            <button className="mt-8 bg-[var(--accent-color)] text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-all">
              Create a Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;