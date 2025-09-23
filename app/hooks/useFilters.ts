// hooks/useFilters.ts
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";

export enum ClientStatus {
  ADHOC = "ADHOC",
  IN_PROGRESS = "IN_PROGRESS",
  ARCHIVE = "ARCHIVE",
  WAITING_ON_AM = "WAITING_ON_AM",
  WAITING_ON_CLIENT = "WAITING_ON_CLIENT",
  TRANSFER = "TRANSFER",
}

export function useFilters() {
  const fetcher = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  // 🔥 Filtro principal
  const [selectedFilter, setSelectedFilter] = useState<"recent" | "date" | null>(
    (searchParams.get("filter") as "recent" | "date") || null
  );

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(
    searchParams.get("from") && searchParams.get("to")
      ? [dayjs(searchParams.get("from")!), dayjs(searchParams.get("to")!)]
      : null
  );

  // 🔥 Filtro de compañía
  const [companyId, setCompanyId] = useState<string | null>(
    searchParams.get("client_id") || null
  );

  // 🔥 Filtro de usuario
  const [userId, setUserId] = useState<string | null>(
    searchParams.get("user_id") || null
  );

  // 🔥 Filtro de débito/crédito
  const [isCredit, setIsCredit] = useState<boolean | null>(() => {
    const val = searchParams.get("is_credit");
    if (val === "true") return true;
    if (val === "false") return false;
    return null;
  });

  // 🔥 Filtro de estado de compañía
  const [companyStatus, setCompanyStatus] = useState<ClientStatus | null>(
    (searchParams.get("currentStatus") as ClientStatus) || null
  );

  const [dataPromise, setDataPromise] = useState<any>(null);

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    // filtro principal
    if (selectedFilter === "recent") {
      params.set("filter", "recent");
    } else if (selectedFilter === "date" && dateRange) {
      params.set("filter", "date");
      params.set("from", dateRange[0].format("YYYY-MM-DD"));
      params.set("to", dateRange[1].format("YYYY-MM-DD"));
    }

    // compañía
    if (companyId) {
      params.set("client_id", companyId);
    }

    // usuario
    if (userId) {
      params.set("user_id", userId);
    }

    // débito/crédito
    if (isCredit !== null) {
      params.set("is_credit", String(isCredit));
    }

    // status
    if (companyStatus) {
      params.set("currentStatus", companyStatus);
    }

    fetcher.submit(params, { method: "get" });
    setSearchParams(params);
  };

  const handleResetFilter = () => {
    setSelectedFilter(null);
    setDateRange(null);
    setCompanyId(null);
    setUserId(null);
    setIsCredit(null);
    setCompanyStatus(null);

    const params = new URLSearchParams();
    fetcher.submit(params, { method: "get" });
    setSearchParams(params);
  };

  useEffect(() => {
    if (fetcher.data) {
      // @ts-ignore
      setDataPromise(fetcher.data.workEntries);
    }
  }, [fetcher.data]);

  return {
    selectedFilter,
    setSelectedFilter,
    dateRange,
    setDateRange,
    companyId,
    setCompanyId,
    userId,
    setUserId,
    isCredit,
    setIsCredit,
    companyStatus,
    setCompanyStatus,
    dataPromise,
    handleApplyFilter,
    handleResetFilter,
    fetcher,
  };
}