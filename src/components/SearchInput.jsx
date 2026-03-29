import { Search, XCircle } from "lucide-react";

function SearchInput({ value, onChange, onClear }) {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-11 pr-10 py-3 bg-gray-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        placeholder="Search"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <XCircle className="h-5 w-5 text-[#1d9bf0]" />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
