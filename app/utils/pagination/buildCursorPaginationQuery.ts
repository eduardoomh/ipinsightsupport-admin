
interface CursorPaginationOptions {
  cursor?: string | null;
  take?: number;
  direction?: "next" | "prev";
  orderByField?: string;
  select?: Record<string, boolean>;
}

export function buildCursorPaginationQuery({
  cursor,
  take = 10,
  direction = "next",
  orderByField = "createdAt",
  select,
}: CursorPaginationOptions) {
  const isBackward = direction === "prev";

  const queryOptions: any = {
    take,
    orderBy: {
      [orderByField]: isBackward ? "asc" : "desc",
    },
  };

  if (select) {
    queryOptions.select = select;
  }

  if (cursor) {
    queryOptions.skip = 1;
    queryOptions.cursor = { id: cursor };
  }

  return { queryOptions, isBackward };
}