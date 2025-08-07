import { useState } from "react";

interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
    endCursor: string | null;
}

export default function usePagination(pageSize: number, pageInfo: PageInfo, onPageChange: (cursor: string, dir: "next" | "prev") => void) {
  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * pageSize + 1;

  const updatePage = (cursor: string, direction: "next" | "prev") => {
    setCurrentPage((prev) => (direction === "next" ? prev + 1 : prev - 1));
    onPageChange(cursor, direction);
  };

  return { currentPage, start, updatePage };
}
