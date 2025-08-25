import { defer } from "@remix-run/node";
import { buildPaginationURL } from "./buildPaginationURL";
import { redirect } from '@remix-run/react';

type ResourceFetch = {
  key: string;
  apiPath: string;
};

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
    const res = await fetch(apiUrl.toString(), {
      headers: { Cookie: request.headers.get("Cookie") || "" },
    });
    if (res.status === 401) throw redirect("/login");
    if (!res.ok) throw new Error("Failed to fetch data");
    return await res.json();
  };

  return defer({
    [key]: fetchFn(),
    take,
  });
}

export async function withTwoResourcesDefer({
  request,
  sessionCheck,
  resources,
}: {
  request: Request;
  sessionCheck: () => Promise<any>;
  resources: [ResourceFetch, ResourceFetch]; // Array con dos recursos a fetch
}) {
  const session = await sessionCheck();
  if (!session) return redirect("/login");

  const cookieHeader = request.headers.get("Cookie") || "";

  // El segundo recurso es el que usamos para paginar
  const { apiUrl, take } = buildPaginationURL(resources[1].apiPath, request.url);

  // Fetch para el primer recurso
  const fetchFirst = async () => {
    const res = await fetch(resources[0].apiPath, {
      headers: { Cookie: cookieHeader },
    });
    if (res.status === 401) throw redirect("/login");
    if (!res.ok) throw new Error(`Failed to fetch ${resources[0].key}`);
    return res.json();
  };

  // Fetch para el segundo recurso, diferido
  const fetchSecond = async () => {
    const res = await fetch(apiUrl.toString(), {
      headers: { Cookie: cookieHeader },
    });
    if (res.status === 401) throw redirect("/login");
    if (!res.ok) throw new Error(`Failed to fetch ${resources[1].key}`);
    return res.json();
  };

  const firstData = await fetchFirst();

  return defer({
    [resources[0].key]: firstData,
    [resources[1].key]: fetchSecond(),
    take,
  });
}