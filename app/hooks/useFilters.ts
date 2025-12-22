import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ClientStatus } from "~/components/TableActions/HeaderActions";

export interface FilterValues {
  selectedFilter: "recent" | "date" | null;
  dateRange: [Dayjs, Dayjs] | null;
  companyId: string | null;
  userId: string | null;
  isCredit: boolean | null;
  companyStatus: ClientStatus | null;
}
export interface FilterActions {
  setSelectedFilter: (val: "recent" | "date" | null) => void;
  setDateRange: (val: [Dayjs, Dayjs] | null) => void;
  setCompanyId: (val: string | null) => void;
  setUserId: (val: string | null) => void;
  setIsCredit: (val: boolean | null) => void;
  setCompanyStatus: (val: ClientStatus | null) => void;
  handleApplyFilter: () => void;
  handleResetFilter: () => void;
}

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estados locales para los inputs del modal/filtro
  const [selectedFilter, setSelectedFilter] = useState<"recent" | "date" | null>(
    (searchParams.get("filter") as "recent" | "date") || null
  );

  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(
    searchParams.get("from") && searchParams.get("to")
      ? [dayjs(searchParams.get("from")!), dayjs(searchParams.get("to")!)]
      : null
  );

  const [companyId, setCompanyId] = useState<string | null>(
    searchParams.get("client_id") || null
  );

  const [userId, setUserId] = useState<string | null>(
    searchParams.get("user_id") || null
  );

  const [isCredit, setIsCredit] = useState<boolean | null>(() => {
    const val = searchParams.get("is_credit");
    if (val === "true") return true;
    if (val === "false") return false;
    return null;
  });

  const [companyStatus, setCompanyStatus] = useState<ClientStatus | null>(
    (searchParams.get("currentStatus") as ClientStatus) || null
  );

  const handleApplyFilter = () => {
    const params = new URLSearchParams();

    // Filtros de fecha
    if (selectedFilter === "recent") {
      params.set("filter", "recent");
    } else if (selectedFilter === "date" && dateRange) {
      params.set("filter", "date");
      params.set("from", dateRange[0].format("YYYY-MM-DD"));
      params.set("to", dateRange[1].format("YYYY-MM-DD"));
    }

    // Otros filtros
    if (companyId) params.set("client_id", companyId);
    if (userId) params.set("user_id", userId);
    if (isCredit !== null) params.set("is_credit", String(isCredit));
    if (companyStatus) params.set("currentStatus", companyStatus);

    params.delete("cursor");
    params.delete("direction");

    setSearchParams(params, { preventScrollReset: true });
  };

  const handleResetFilter = () => {
    setSelectedFilter(null);
    setDateRange(null);
    setCompanyId(null);
    setUserId(null);
    setIsCredit(null);
    setCompanyStatus(null);
    setSearchParams({}, { preventScrollReset: true });
  };

  const filterValues = {
    selectedFilter,
    dateRange,
    companyId,
    userId,
    isCredit,
    companyStatus
  };

  const filterActions = {
    setSelectedFilter,
    setDateRange,
    setCompanyId,
    setUserId,
    setIsCredit,
    setCompanyStatus,
    handleApplyFilter,
    handleResetFilter
  };

  return {
    filterValues,
    filterActions
  };
}