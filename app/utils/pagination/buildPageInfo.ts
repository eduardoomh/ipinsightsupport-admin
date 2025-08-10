// buildPageInfo.ts
export function buildPageInfo<T extends { id: string }>(
  items: T[],
  take: number,                 // tamaño real de página (sin +1)
  isBackward: boolean,
  cursor?: string | null
) {
  let hasNextPage = false;
  let hasPreviousPage = false;

  // Si devolvimos más de `take`, hay "más" en la dirección en la que pedimos
  if (items.length > take) {
    if (isBackward) {
      // pedimos hacia atrás y hay un elemento extra → hay más prev (más antiguos)
      hasPreviousPage = true;
    } else {
      // pedimos hacia adelante y hay un elemento extra → hay más next (más nuevos)
      hasNextPage = true;
    }
    // recortamos al tamaño real
    items = items.slice(0, take);
  }

  // Si pedimos hacia adelante y había cursor => hay página anterior
  if (!isBackward && Boolean(cursor)) {
    hasPreviousPage = true;
  }

  // Si pedimos hacia atrás y había cursor => hay página siguiente (la que venías)
  if (isBackward && Boolean(cursor)) {
    hasNextPage = true;
  }

  // Si pedimos hacia atrás, invertimos para devolver en orden "desc" consistente para la UI
  if (isBackward) {
    items = items.reverse();
  }

  const startCursor = items.length > 0 ? items[0].id : null;
  const endCursor = items.length > 0 ? items[items.length - 1].id : null;

  return {
    items,
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor,
      endCursor,
    },
  };
}