// utils/hooks/useCursorPagination.ts
import { useLoaderData, useSearchParams } from "@remix-run/react";

export function useCursorPagination<T>(key: string) {
  const data = useLoaderData() as Record<string, unknown> & { take: number };
  const [_, setSearchParams] = useSearchParams();

  const handlePageChange = (cursor: string, direction: "next" | "prev") => {
    setSearchParams({
      cursor,
      direction,
      take: data.take.toString(),
    });
  };

  return {
    data: data[key] as T,
    take: data.take,
    handlePageChange,
  };
}