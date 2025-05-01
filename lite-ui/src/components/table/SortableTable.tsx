import { Table } from "@mantine/core";
import { useState, useMemo } from "react";

export type SortDirection = "asc" | "desc";

export type Column<T> = {
  label: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
};

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  intialSortBy: string | null;
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
}

export function SortableTable<T>({
  data,
  columns,
  intialSortBy,
  rowKey,
  onRowClick,
}: SortableTableProps<T>) {
  const [sortBy, setSortBy] = useState<string | null>(intialSortBy);
  const [direction, setDirection] = useState<SortDirection>("asc");

  const handleSort = (accessor: string) => {
    if (sortBy === accessor) {
      setDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(accessor);
      setDirection("asc");
    }
  };

  const getValue = (row: any, accessor: string) => {
    const parts = accessor.split(".");
    return parts.reduce((acc, key) => acc?.[key], row);
  };

  const sortedData = useMemo(() => {
    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      const aVal = getValue(a, sortBy);
      const bVal = getValue(b, sortBy);

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return direction === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [data, sortBy, direction]);

  const getSortIndicator = (accessor: string) => {
    if (sortBy !== accessor) return "▲ ▼";
    return direction === "asc" ? "▲" : "▼";
  };

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.accessor.toString()}
              onClick={() => handleSort(col.accessor.toString())}
              style={{ cursor: "pointer" }}
            >
              {col.label} {getSortIndicator(col.accessor.toString())}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr
            key={rowKey(row)}
            onClick={() => onRowClick?.(row)}
            style={{ cursor: onRowClick ? "pointer" : "default" }}
          >
            {columns.map((col) => (
              <td key={col.accessor.toString()}>
                {col.render
                  ? col.render(row)
                  : String(getValue(row, col.accessor.toString()))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
