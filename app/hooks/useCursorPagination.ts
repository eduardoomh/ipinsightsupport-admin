import { useLoaderData, useSearchParams } from "@remix-run/react";

export function useCursorPagination<T>(key: string) {
  const data = useLoaderData() as Record<string, any>;
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageChange = (cursor: string, direction: "next" | "prev") => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("cursor", cursor);
    newParams.set("direction", direction);
    newParams.set("take", (data.take || 6).toString());

    setSearchParams(newParams, { preventScrollReset: true });
  };

  return {
    data: data[key] as T,
    take: data.take || 6,
    handlePageChange,
  };
}