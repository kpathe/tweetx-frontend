const FeedTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["For you", "Following"];

  return (
    <div className="flex w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="flex-1 hover:bg-gray-100/50 dark:hover:bg-slate-900/50 transition-all font-bold relative group"
        >
          <div className="py-4 flex flex-col items-center">
            <span
              className={`text-[15px] transition-colors ${
                activeTab === tab
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
              }`}
            >
              {tab}
            </span>
            {activeTab === tab && (
              <div className="absolute bottom-0 w-14 h-1 bg-violet-600 dark:bg-violet-500 rounded-full" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default FeedTabs;
