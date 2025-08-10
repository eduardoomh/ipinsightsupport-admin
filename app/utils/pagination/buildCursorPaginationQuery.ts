
interface CursorPaginationOptions {
  cursor?: string | null;
  take?: number;
  direction?: "next" | "prev";
  orderByField?: string;
  select?: Record<string, boolean>;
}

// buildCursorPaginationQuery.ts
export function buildCursorPaginationQuery({
  cursor,
  take = 10,
  direction = "next",
  orderByField = "createdAt",
  select,
}: CursorPaginationOptions) {
  const isBackward = direction === "prev";

  const queryOptions: any = {
    // pedimos uno extra para detectar si hay más
    take: take + 1,
    orderBy: {
      [orderByField]: isBackward ? "asc" : "desc",
    },
  };

  if (select) {
    queryOptions.select = select;
  }

  if (cursor) {
    queryOptions.skip = 1; // omitimos el cursor mismo
    queryOptions.cursor = { id: cursor };
  }

  return { queryOptions, isBackward };
}