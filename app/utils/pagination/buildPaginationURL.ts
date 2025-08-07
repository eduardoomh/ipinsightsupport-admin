// utils/pagination/buildPaginationURL.ts

export function buildPaginationURL(baseURL: string, requestUrl: string) {
  const request = new URL(requestUrl);
  const cursor = request.searchParams.get("cursor");
  const direction = request.searchParams.get("direction") || "next";
  const take = request.searchParams.get("take") || "6";

  const apiUrl = new URL(baseURL);
  if (cursor) apiUrl.searchParams.set("cursor", cursor);
  apiUrl.searchParams.set("direction", direction);
  apiUrl.searchParams.set("take", take);

  return { apiUrl, take: Number(take) };
}