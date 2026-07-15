import { Filter } from "lucide-react";
import { LOG_LEVELS } from "../../constants";

/**
 * Log level dropdown filter.
 */
const LevelFilter = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
      >
        <option value="">All Levels</option>
        {Object.values(LOG_LEVELS).map((level) => (
          <option key={level} value={level}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LevelFilter;
