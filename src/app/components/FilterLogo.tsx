import { Filter } from "lucide-react";
import React from "react";

const FilterLogo = ({ onClick, className = "" }: { onClick?: () => void; className?: string }) => (
  <Filter
    onClick={onClick}
    className={`w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer ${className}`}
    aria-label="Show filters"
  />
);

export default FilterLogo; 