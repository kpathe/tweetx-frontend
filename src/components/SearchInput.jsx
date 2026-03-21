import { Search, XCircle } from "lucide-react";

function SearchInput({ value, onChange, onClear }) {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#1d9bf0]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-11 pr-10 py-3 bg-gray-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-[#1d9bf0] focus:bg-white dark:focus:bg-black transition-all outline-none"
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
