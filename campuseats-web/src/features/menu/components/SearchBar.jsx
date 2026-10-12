export default function SearchBar({ value, onChange, placeholder = "Search…" }) {
  return (
    <input
      className="search-input"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
