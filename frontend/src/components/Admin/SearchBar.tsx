import React, { useState, useEffect } from "react";
import _ from "lodash";


interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;

}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search...", 
  onSearch,  
}) => {
  const [query, setQuery] = useState("");
  
  const debouncedSearch = _.debounce((value: string) => {
    onSearch(value);
  }, 500);

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value.trim());
  };

  return (
    <div className={`flex justify-end rounded-lg px-10 pt-5 py-2 shadow-l`}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="outline-orange-400 w-4/12 bg-white shadow-lg text-sm p-4 rounded-lg"
      />
    </div>
  );
};

export default SearchBar;