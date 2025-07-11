"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/home";
import PreferencesModel from "./components/PreferancesModel";
import SearchBar from "./components/SearchBar";

export default function Page() {
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  // Declare this state to fix the error
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedQuery = localStorage.getItem("preferredQuery");
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");

    if (savedQuery) setQuery(savedQuery);
    setSearchHistory(history);
    setRefreshKey((k) => k + 1); // Initial fetch
  }, []);

  const handleSearch = () => {
    const updatedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(updatedHistory);
    setRefreshKey((k) => k + 1); // Trigger re-fetch
  };

  return (
    <>
      <Header onOpenPreferences={() => setPreferencesOpen(true)} />

      {/* SearchBar below Header */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        searchHistory={searchHistory}
      />

      <Home query={query} refreshKey={refreshKey} />

      <PreferencesModel
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        onSave={() => {
          setPreferencesOpen(false);
          setRefreshKey((k) => k + 1);
        }}
      />
    </>
  );
}
