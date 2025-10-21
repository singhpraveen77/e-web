import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggle } = useTheme();

  const nextLabel = resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <div className="inline-flex items-center gap-2">
      {/* Primary toggle (cycles light/dark) */}
      <button
        type="button"
        onClick={toggle}
        className="transition-base inline-flex items-center justify-center rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-2 hover:shadow-sm hover:bg-[rgb(var(--bg))]"
        aria-pressed={resolvedTheme === "dark"}
        aria-label={nextLabel}
        title={nextLabel}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <Moon className="h-4 w-4 absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      </button>

      {/* Optional: system selector (small discrete control) */}
      <div className="hidden  relative lg:flex  w-full">
        <select
          aria-label="Theme preference"
          className="transition-base bg-[rgb(var(--card))]  border-[rgb(var(--border))] rounded-md py-1 pl-2 pr-6 text-sm text-[rgb(var(--fg))] hover:bg-[rgb(var(--bg))]"
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <Laptop className=" absolute pointer-events-none right-5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-60" />
      </div>
    </div>
  );
}
