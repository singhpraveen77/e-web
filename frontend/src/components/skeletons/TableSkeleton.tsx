import React from "react";

export interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

const widths = ["w-75", "w-50", "w-66", "w-33", "w-90", "w-40"] as const;

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 6, cols = 5 }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-[rgb(var(--border))]">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="text-left p-2 sm:p-3">
                <div className="skeleton skeleton--text w-50" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-[rgb(var(--border))]">
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="p-2 sm:p-3">
                  <div className={`skeleton skeleton--text ${widths[(r + c) % widths.length]}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;