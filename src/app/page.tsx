"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/home";
import PreferencesModel from "./components/PreferancesModel";
import SearchBar from "./components/SearchBar";
import { FilterValues } from "./components/FilterCard";

export default function Page() {
  const [query, setQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [preferredSources, setPreferredSources] = useState<string[]>([]);
  const [preferredCategories, setPreferredCategories] = useState<string[]>([]);

  useEffect(() => {
    const savedQuery = localStorage.getItem("preferredQuery");
    const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    const savedSources = localStorage.getItem("preferredSources");
    const savedCategories = localStorage.getItem("preferredCategories");
    if (savedQuery) setQuery(savedQuery);
    setSearchHistory(history);
    setPreferredSources(savedSources ? JSON.parse(savedSources) : []);
    setPreferredCategories(savedCategories ? JSON.parse(savedCategories) : []);
    setRefreshKey((k) => k + 1); // Initial fetch
  }, []);

  const handleSearch = () => {
    const updatedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(updatedHistory);
    setRefreshKey((k) => k + 1); // Trigger re-fetch
  };

  const handleSaveFilters = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setShowFilters(false);
    setRefreshKey((k) => k + 1);
  };

  const handleClearFilters = () => {
    setFilters(null);
    setShowFilters(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <>
      <Header onOpenPreferences={() => setPreferencesOpen(true)} />
      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        searchHistory={searchHistory}
        onFilterClick={() => setShowFilters((v) => !v)}
      />
      <Home
        query={query}
        refreshKey={refreshKey}
        showFilters={showFilters}
        onCloseFilters={() => setShowFilters(false)}
        filters={filters}
        onSaveFilters={handleSaveFilters}
        onClearFilters={handleClearFilters}
        preferredSources={preferredSources}
        preferredCategories={preferredCategories}
      />
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
