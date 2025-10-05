import { LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { getUserId } from "~/config/session.server";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
  
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");
    const takeParam = url.searchParams.get("take");
    const direction = url.searchParams.get("direction") as "next" | "prev";
    const source = url.searchParams.get("source");
    const level = url.searchParams.get("level");
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
  
    const take = takeParam ? parseInt(takeParam, 10) : 10;
  
    const { queryOptions, isBackward } = buildCursorPaginationQuery({
      cursor,
      take,
      direction,
      orderByField: "createdAt",
    });
  
    // Filtros dinámicos
    queryOptions.where = {
      ...(queryOptions.where || {}),
      ...(source ? { source } : {}),
      ...(level ? { level } : {}),
      ...(from && to
        ? { createdAt: { gte: new Date(from), lte: new Date(to) } }
        : {}),
    };
  
    queryOptions.select = {
      id: true,
      source: true,
      level: true,
      message: true,
      details: true,
      createdAt: true,
    };
  
    const logs = await prisma.log.findMany(queryOptions);
  
    const { items, pageInfo } = buildPageInfo(logs, take, isBackward, cursor);
  
    return new Response(
      JSON.stringify({ logs: items, pageInfo }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  };