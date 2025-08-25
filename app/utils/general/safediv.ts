export const safeDiv = (funds: number, r: number) =>
  Number.isFinite(r) && r > 0 ? funds / r : 0.0;