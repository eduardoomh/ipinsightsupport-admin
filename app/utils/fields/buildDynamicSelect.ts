// utils/buildDynamicSelect.ts
export function buildDynamicSelect(
  fieldsParam: string | null,
  defaultSelect: Record<string, boolean>
): Record<string, boolean> {
  if (fieldsParam) {
    return fieldsParam.split(",").reduce((acc, field) => {
      const trimmed = field.trim();
      if (trimmed) acc[trimmed] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }
  return defaultSelect;
}