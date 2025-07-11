import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
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
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("preferredSources");
      if (saved) setSelectedSources(JSON.parse(saved));
    }
    const savedCategory = localStorage.getItem("preferredCategory");
    const savedQuery = localStorage.getItem("preferredQuery");
    setSelectedCategory(savedCategory || "");
    setQuery(savedQuery || "");
  }, [isOpen]);

  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const savePreferences = () => {
    localStorage.setItem("preferredSources", JSON.stringify(selectedSources));
    localStorage.setItem("preferredCategory", selectedCategory);
    localStorage.setItem("preferredQuery", query);
    onClose();
  };

  const resetAll = () => setSelectedSources([]);

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

          {/* Search */}
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-1">
             Search Keywords
            </h3>
            <p className="text-sm text-black mb-2">
              Enter keywords to personalize your feed. Leave empty to show all.
            </p>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., climate change, technology, Elon Musk..."
            />
          </div>

          {/* Sources */}
          <div className="mb-6">
            <h3 className="font-semibold text-black mb-1">
              News Sources
            </h3>
            <p className="text-sm text-black mb-2">
              Select preferred sources. Leave empty to show from all.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOURCE_OPTIONS.map((source) => (
                <label
                  key={source.id}
                  className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer transition ${
                    selectedSources.includes(source.id)
                      ? "border-red-500 bg-red-50"
                      : "border-gray-600"
                  }`}
                >
                  <Checkbox
                    checked={selectedSources.includes(source.id)}
                    onCheckedChange={() => toggleSource(source.id)}
                  />
                  <span className="text-sm text-black">
                    {source.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

           {/* Categories  */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-1">
              Category
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Choose one category. Leave empty to include all.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className="text-sm capitalize"
                >
                  {cat}
                </Button>
              ))}

              {/* All */}
              <Button
                variant={selectedCategory === "" ? "secondary" : "outline"}
                onClick={() => setSelectedCategory("")}
                className="text-sm"
              >
                All Categories
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t dark:border-gray-800">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetAll}>
                Reset
              </Button>
              <Button onClick={savePreferences}> Save Preferences</Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}