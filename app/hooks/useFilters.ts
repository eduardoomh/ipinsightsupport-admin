import { useFetcher, useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";

export function useFilters() {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado de filtros
  const [selectedFilter, setSelectedFilter] = useState<"recent" | "date" | null>(
    (searchParams.get("filter") as any) || null
  );

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(
    searchParams.get("from") && searchParams.get("to")
      ? [dayjs(searchParams.get("from")), dayjs(searchParams.get("to"))]
      : null
  );

  // Promesa de datos que cambia según filtros
  const [dataPromise, setDataPromise] = useState<any>(null);

  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    if (selectedFilter === "recent") {
      params.set("filter", "recent");
    } else if (selectedFilter === "date" && dateRange) {
      params.set("filter", "date");
      params.set("from", dateRange[0].format("YYYY-MM-DD"));
      params.set("to", dateRange[1].format("YYYY-MM-DD"));
    }

    fetcher.submit(params, { method: "get" });
    setSearchParams(params);
  };

  const handleResetFilter = () => {
    setSelectedFilter(null);
    setDateRange(null);
    const params = new URLSearchParams();
    fetcher.submit(params, { method: "get" });
    setSearchParams(params);
  };

  // Sync con fetcher
  useEffect(() => {
    if (fetcher.data) {
      // @ts-ignore
      setDataPromise(fetcher.data.workEntries);
    }
  }, [fetcher.data]);

  return {
    // Estado
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    dataPromise,

    // Acciones
    handleApplyFilter,
    handleResetFilter,

    // Fetcher (por si quieres usarlo fuera)
    fetcher,
  };
}