"use client";

import { useEffect, useState } from "react";
import { Search, X, Trash2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
  searchHistory: string[];
}

export default function SearchBar({
  query,
  setQuery,
  onSearch,
  searchHistory,
}: SearchBarProps) {
  const [localHistory, setLocalHistory] = useState<string[]>([]);

  useEffect(() => {
    setLocalHistory(searchHistory);
  }, [searchHistory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const existing = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    const updated = [query, ...existing.filter((item: string) => item !== query)].slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    localStorage.setItem("preferredQuery", query);
    setLocalHistory(updated);
    onSearch();
  };

  const handleClear = () => {
    setQuery("");
    localStorage.removeItem("preferredQuery");
    onSearch(); // Trigger refresh with empty query
  };

  const handleClearHistory = () => {
    localStorage.removeItem("searchHistory");
    setLocalHistory([]);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 flex flex-col gap-3">
      {/*  Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="pl-10 pr-10 py-2 text-sm"
          />
          {query && (
            <X
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label="Clear search"
            />
          )}
        </div>
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      {/*  Search History */}
      {localHistory.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex flex-wrap gap-2">
            <span className="font-medium">Recent:</span>
            {localHistory.map((keyword, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(keyword);
                  localStorage.setItem("preferredQuery", keyword);
                  onSearch();
                }}
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
