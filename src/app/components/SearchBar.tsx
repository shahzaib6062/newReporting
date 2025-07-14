"use client";

import { useEffect, useState } from "react";
import { Search, X, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import FilterLogo from "./FilterLogo";

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  searchHistory: string[];
  onFilterClick?: () => void;
}

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  searchHistory,
  onFilterClick,
}: SearchBarProps) {
  const [localHistory, setLocalHistory] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    setLocalHistory(searchHistory);
  }, [searchHistory]);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedQuery.trim()) {
        localStorage.setItem("preferredQuery", debouncedQuery);
        updateSearchHistory(debouncedQuery);
        onSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedQuery, onSearch]);

  const updateSearchHistory = (keyword: string) => {
    const existing = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    const updated = [keyword, ...existing.filter((item: string) => item !== keyword)].slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    setLocalHistory(updated);
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    localStorage.removeItem("preferredQuery");
    onSearch();
  };

  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setLocalHistory([]);
  };

  const handleRecentClick = (keyword: string) => {
    setQuery(keyword);
    setDebouncedQuery(keyword);
    localStorage.setItem("preferredQuery", keyword);
    updateSearchHistory(keyword);
    onSearch();
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 flex flex-col gap-3">
      <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setDebouncedQuery(e.target.value);
            }}
            placeholder="Search articles..."
            className="pl-10 pr-16 py-2 text-sm"
          />
          {query && (
            <X
              onClick={handleClear}
              className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Clear search"
            />
          )}
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <FilterLogo onClick={onFilterClick} />
          </span>
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {localHistory.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex flex-wrap gap-2">
            <span className="font-medium">Recent:</span>
            {localHistory.map((keyword, idx) => (
              <button
                key={idx}
                onClick={() => handleRecentClick(keyword)}
                className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 transition text-xs"
              >
                {keyword}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Clear history
          </button>
        </div>
      )}
    </div>
  );
}
