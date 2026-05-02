import { Search, XCircle } from "lucide-react";

function SearchInput({ value, onChange, onClear }) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5" style={{ color: "var(--text-secondary)" }} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-11 pr-10 py-3 rounded-full outline-none transition-colors"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "1px solid transparent",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--accent-color)";
          e.target.style.backgroundColor = "transparent";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "transparent";
          e.target.style.backgroundColor = "var(--bg-secondary)";
        }}
        placeholder="Search"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          <XCircle className="h-5 w-5 transition-colors" style={{ color: "var(--accent-color)" }} />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
