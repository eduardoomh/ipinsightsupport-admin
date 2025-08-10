// hooks/useRefreshAndResetPagination.ts
import { useRevalidator, useNavigate } from "@remix-run/react";

export function useRefreshAndResetPagination(path: string) {
  const revalidator = useRevalidator();
  const navigate = useNavigate();

  const refresh = () => {
    navigate(path, { replace: true });
    revalidator.revalidate();
  };

  return refresh;
}