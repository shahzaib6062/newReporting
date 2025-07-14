import { X, Save } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type FilterValues = {
  category: string;
  source: string;
  fromDate: string;
  toDate: string;
};

const defaultFilters: FilterValues = {
  category: "all",
  source: "all",
  fromDate: "",
  toDate: "",
};

const FilterCard = ({
  onClose,
  onSave,
  onClear,
  initialFilters = defaultFilters,
}: {
  onClose?: () => void;
  onSave?: (filters: FilterValues) => void;
  onClear?: () => void;
  initialFilters?: FilterValues;
}) => {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave?.(filters);
  };

  const handleClear = () => {
    setFilters(defaultFilters);
    onClear?.();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full mx-auto max-w-3xl bg-white rounded-xl shadow-lg p-0 border-none"
        style={{ boxShadow: "0 4px 24px 0 rgba(80, 63, 205, 0.08)" }}
      >
        <div className="h-2 w-full rounded-t-xl bg-gradient-to-r from-red-400 to-red-600" />
        <div className="p-8 pt-6 relative">
          {onClose && (
            <button
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              onClick={onClose}
              aria-label="Close filter card"
            >
              <X className="w-6 h-6" />
            </button>
          )}

          <div className="flex flex-wrap gap-6 mb-8">
            {/* Category */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Categories</option>
                <option value="technology">Technology</option>
                <option value="sports">Sports</option>
                <option value="business">Business</option>
                <option value="health">Health</option>
                <option value="entertainment">Entertainment</option>
                <option value="science">Science</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Source */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Source</label>
              <select
                name="source"
                value={filters.source}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="all">All Sources</option>
                <option value="newsapi">NewsAPI</option>
                <option value="guardian">The Guardian</option>
                <option value="nyt">The New York Times</option>
                <option value="mediastack">Mediastack</option>
                <option value="currents">Currents API</option>
                <option value="gnews">GNews API</option>
              </select>
            </div>

            {/* From Date */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">From Date</label>
              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* To Date */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8">
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-red-400 to-red-600 shadow-sm hover:from-red-500 hover:to-red-700 transition"
              onClick={handleSave}
            >
              <Save className="w-5 h-5" /> Save Search
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-200"
              onClick={handleClear}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterCard;
