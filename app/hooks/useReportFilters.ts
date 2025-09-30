// hooks/useReportFilters.ts
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

export function useReportFilters() {
    const fetcher = useFetcher();
    const [searchParams, setSearchParams] = useSearchParams();
  
    const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>(() => {
      const from = searchParams.get("from");
      const to = searchParams.get("to");
  
      if (from && to) return [dayjs(from), dayjs(to)];
      return [dayjs().startOf("month"), dayjs().endOf("month")];
    });
  
    const handleApplyFilter = () => {
      const params = new URLSearchParams();
      if (dateRange) {
        params.set("from", dateRange[0].format("YYYY-MM-DD"));
        params.set("to", dateRange[1].format("YYYY-MM-DD"));
      }
      fetcher.submit(params, { method: "get" });
      setSearchParams(params);
    };
  
    const isLoading = fetcher.state === "loading" || fetcher.state === "submitting";
  
    return { dateRange, setDateRange, handleApplyFilter, fetcher, isLoading };
  }