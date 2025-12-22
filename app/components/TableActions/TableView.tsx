// components/shared/TableView.tsx
import { Await, Outlet } from "@remix-run/react";
import { Suspense, ReactNode } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";

interface TableViewProps<T> {
  resolve: any; 
  skeleton: ReactNode;
  headerActions: ReactNode;
  baseUrl: string;
  children: (data: T, pageInfo: any) => ReactNode;
}

export function TableView<T>({
  resolve,
  skeleton,
  headerActions,
  baseUrl,
  children,
}: TableViewProps<T>) {
  const refreshResults = useRefreshAndResetPagination(baseUrl);

  return (
    <DashboardLayout title="" headerActions={headerActions}>
      <Suspense fallback={skeleton}>
        <Await resolve={resolve}>
          {(data: any) => {
            const key = Object.keys(data).find((k) => Array.isArray(data[k])) || "";
            const items = data[key];
            const pageInfo = data.pageInfo;

            return (
              <>
                {children(items, pageInfo)}
                <Outlet context={{ refreshResults }} />
              </>
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}