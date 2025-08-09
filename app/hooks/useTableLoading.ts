import { useState, useEffect } from "react";

export function useTableLoading<T>(
  data: T[],
  onPageChange: (cursor: string, direction: "next" | "prev") => void
) {
  const [loading, setLoading] = useState(false);

  // Cuando se llama al cambiar de página, activamos loading
  const handlePageChange = (cursor: string, direction: "next" | "prev") => {
    setLoading(true);
    onPageChange(cursor, direction);
  };

  // Cuando cambia la data (llegaron nuevos datos), desactivamos loading
  useEffect(() => {
    setLoading(false);
  }, [data]);

  return {
    loading,
    handlePageChange,
  };
}