import { defer } from "@remix-run/node";
import { buildPaginationURL } from "./buildPaginationURL";
import { redirect } from '@remix-run/react';

// utils/pagination/withPaginationDefer.ts
export async function withPaginationDefer({
  request,
  apiPath,
  sessionCheck,
  key = "data",
}: {
  request: Request;
  apiPath: string;
  sessionCheck: () => Promise<any>;
  key?: string;
}) {
  const session = await sessionCheck();
  if (!session) return redirect("/login");

  const { apiUrl, take } = buildPaginationURL(apiPath, request.url);

  const fetchFn = async () => {
    const res = await fetch(apiUrl.toString());
    if (!res.ok) throw new Error("Failed to fetch data");
    return await res.json();
  };

  return defer({
    [key]: fetchFn(),
    take,
  });
}