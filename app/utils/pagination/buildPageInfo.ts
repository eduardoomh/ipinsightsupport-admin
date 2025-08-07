
export function buildPageInfo<T extends { id: string }>(items: T[], take: number, isBackward: boolean) {
  if (isBackward) {
    items = items.reverse();
  }

  const hasNextPage = items.length === take;
  const startCursor = items.length > 0 ? items[0].id : null;
  const endCursor = items.length > 0 ? items[items.length - 1].id : null;

  return {
    items,
    pageInfo: {
      hasNextPage,
      hasPreviousPage: startCursor !== null,
      startCursor,
      endCursor,
    },
  };
}