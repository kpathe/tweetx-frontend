const FeedTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["For you", "Following"];

  return (
    <div className="flex w-full bg-[var(--bg-primary)] border-b border-[var(--border-color)] px-4">
      <div className="flex flex-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="hover:bg-[var(--bg-tertiary)] transition-all font-bold relative group px-4"
          >
            <div className="py-4 flex flex-col items-center">
              <span
                className={`text-[15px] transition-colors ${
                  activeTab === tab
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"
                }`}
              >
                {tab}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 w-full h-1 bg-[var(--accent-color)] rounded-full" />
              )}
            </div>
          </button>
        ))}
      </div>
      <button className="p-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-full transition-colors">
         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </button>
    </div>
  );
};

export default FeedTabs;
