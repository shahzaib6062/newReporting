"use client";

import { useState } from 'react';
import Header from './components/Header';
import Home from './pages/home';

function App() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    // This will be handled by the Home component
  };

  return (
    <>
      <Header query={query} setQuery={setQuery} onSearch={handleSearch} />
      <Home />
    </>
  );
}

export default App;
