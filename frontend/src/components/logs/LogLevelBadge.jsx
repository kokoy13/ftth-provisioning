import { LOG_LEVEL_THEMES } from "../../constants";
import { capitalize } from "../../helpers";

/**
 * Color-coded log level severity badge.
 */
const LogLevelBadge = ({ level }) => {
  const theme = LOG_LEVEL_THEMES[level] || LOG_LEVEL_THEMES.INFO;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${theme}`}>
      {capitalize(level)}
    </span>
  );
};

export default LogLevelBadge;
