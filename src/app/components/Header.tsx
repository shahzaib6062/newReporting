import { useState } from "react";
import PreferencesModel from "./PreferancesModel";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Settings, Search, Newspaper } from "lucide-react";

export default function Header({
  query,
  setQuery,
  onSearch,
}: {
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
}) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onSearch();
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h1 className="text-xl font-bold text-red-600 dark:text-red-400">
            News Aggregator
          </h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="w-full sm:max-w-md"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 text-sm"
            />
          </div>
        </form>
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto flex items-center gap-2 cursor-pointer hover:border-black"
        >
          <Settings className="w-4 h-4" />
          Preferences
        </Button>
      </div>
      <PreferencesModel isOpen={open} onClose={handleClose} />
    </header>
  );
}
