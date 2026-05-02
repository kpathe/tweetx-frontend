import React, { useEffect, useState } from "react";
import { Heart, User, MessageCircle } from "lucide-react";
import { MainLayout } from "../components";
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

  return (
    <MainLayout>
      <div className="w-full min-h-screen">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {loading ? (
            <div className="p-10 text-center animate-pulse text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer ${
                  !notif.isRead ? "bg-violet-50/30 dark:bg-violet-900/10" : ""
                }`}
              >
                <div className="pt-1">{getIcon(notif.type)}</div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          notif.sender?.profileImage ||
                          "https://via.placeholder.com/150"
                        }
                        className="w-8 h-8 rounded-full object-cover"
                        alt={notif.sender?.username}
                      />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {notif.sender?.fullName}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    {getMessage(notif)}
                  </p>
                  {(notif.type === "like" || notif.type === "reply") &&
                    notif.tweet && (
                      <Link
                        to={`/tweet/${notif.tweet._id}`}
                        className="mt-2 p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-sm text-gray-500 truncate hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        {notif.tweet.content}
                      </Link>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-gray-500 italic">
              No notifications yet. Interactions will appear here.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default Notifications;