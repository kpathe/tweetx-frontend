const FeedTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["For you", "Following"];

  return (
    <div className="sticky flex top-0 z-30 bg-white dark:bg-slate-950 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="flex-1 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors pt-4 font-semibold relative text-gray-900 dark:text-white"
        >
          <div className="pb-4 inline-block relative">
            <span
              className={`text-base transition-colors ${
                activeTab === tab
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {tab}
            </span>
            {/* The Violet Underline */}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-violet-600 dark:bg-violet-500 rounded-full" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default FeedTabs;
