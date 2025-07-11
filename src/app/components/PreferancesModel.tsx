"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { motion } from "framer-motion";

const SOURCE_OPTIONS = [
  { id: "newsapi", label: "NewsAPI (70,000+ sources)" },
  { id: "guardian", label: "The Guardian" },
  { id: "nyt", label: "The New York Times" },
  { id: "mediastack", label: "Mediastack" },
  { id: "currents", label: "Currents API" },
  { id: "gnews", label: "GNews API" },
];

export default function PreferencesModel({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      const savedSources = localStorage.getItem("preferredSources");
      const savedCategories = localStorage.getItem("preferredCategories");
      setSelectedSources(savedSources ? JSON.parse(savedSources) : []);
      setSelectedCategories(savedCategories ? JSON.parse(savedCategories) : []);
    }
  }, [isOpen]);

  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const savePreferences = () => {
    localStorage.setItem("preferredSources", JSON.stringify(selectedSources));
    localStorage.setItem("preferredCategories", JSON.stringify(selectedCategories));
    onSave();
  };

  const resetAll = () => {
    setSelectedSources([]);
    setSelectedCategories([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.15 }}
        >
          <DialogHeader className="flex items-center justify-between mb-4">
            <DialogTitle className="text-red-600 text-2xl">
              Customize Your News Feed
            </DialogTitle>
          </DialogHeader>

          {/* News Sources */}
          <div className="bg-white border border-purple-200 rounded-xl shadow p-6 mb-6">
            <h3 className="font-bold text-lg text-black mb-2">News Sources</h3>
            <p className="text-sm text-gray-500 mb-4">
              Select your preferred sources. Leave empty to include all.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SOURCE_OPTIONS.map((source) => (
                <label
                  key={source.id}
                  className={`flex items-center gap-2 p-3 border-2 rounded-md cursor-pointer transition ${
                    selectedSources.includes(source.id)
                      ? "border-red-600 bg-gray-200"
                      : "border-gray-900"
                  } hover:bg-gray-200`}
                >
                  <Checkbox
                    checked={selectedSources.includes(source.id)}
                    onCheckedChange={() => toggleSource(source.id)}
                    className="accent-red-600"
                  />
                  <span className="text-sm text-black">{source.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border border-purple-200 rounded-xl shadow p-6 mb-6">
            <h3 className="font-bold text-lg text-black mb-2">Categories</h3>
            <p className="text-sm text-gray-500 mb-4">
              Choose one category. Leave empty to see all.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "business",
                "entertainment",
                "general",
                "health",
                "science",
                "sports",
                "technology",
              ].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategories.includes(cat) ? "default" : "outline"}
                  onClick={() => toggleCategory(cat)}
                  className={`text-sm capitalize border-2 rounded-md ${selectedCategories.includes(cat) ? 'border-red-600 bg-gray-200' : 'border-gray-900 hover:bg-gray-200'}`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer hover:bg-gray-200"
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetAll}
                className="cursor-pointer hover:bg-gray-200"
              >
                Reset All
              </Button>
              <Button
                variant="outline"
                onClick={savePreferences}
                className="cursor-pointer hover:bg-gray-200"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
