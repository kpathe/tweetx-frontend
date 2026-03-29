import React from "react";
import { Heart, User, MessageCircle, Repeat2 } from "lucide-react";

const mockNotifications = [
  { id: 1, type: "like", user: "Piyush Garg", content: "liked your tweet", time: "2h" },
  { id: 2, type: "follow", user: "Hricha Sharma", content: "followed you", time: "5h" },
  { id: 3, type: "reply", user: "Rajesh Kumar", content: "replied to your tweet: 'Day 146 🚀'", time: "10h" },
  { id: 4, type: "retweet", user: "Dev_Community", content: "reposted your tweet", time: "1d" },
];

function Notifications() {
  const getIcon = (type) => {
    switch (type) {
      case "like": return <Heart className="text-pink-600 fill-pink-600 w-6 h-6" />;
      case "follow": return <User className="text-[#1d9bf0] fill-[#1d9bf0] w-6 h-6" />;
      case "reply": return <MessageCircle className="text-[#1d9bf0] w-6 h-6" />;
      case "retweet": return <Repeat2 className="text-green-500 w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-slate-950 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {mockNotifications.map((notif) => (
          <div key={notif.id} className="p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
            <div className="pt-1">{getIcon(notif.type)}</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold">{notif.user}</span>
                <span className="text-gray-500 text-sm">{notif.time}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{notif.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;