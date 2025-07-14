"use client";

import { Button } from "./ui/button";
import { Settings, Newspaper } from "lucide-react";

export default function Header({
  onOpenPreferences,
}: {
  onOpenPreferences: () => void;
}) {
  return (
    <header className="bg-white backdrop-blur-md shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/*  Logo */}
        <div className="flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-red-600" />
          <h1 className="text-xl font-bold text-red-600">News Aggregator</h1>
        </div>

        {/* Preferences */}
        <Button
          variant="outline"
          onClick={onOpenPreferences}
          className="flex items-center gap-2 cursor-pointer hover:border-black"
          aria-label="Open preferences"
        >
          <Settings className="w-4 h-4" />
          Preferences
        </Button>
      </div>
    </header>
  );
}
