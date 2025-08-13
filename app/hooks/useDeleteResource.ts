// utils/hooks/useDeleteResource.ts
export function useDeleteResource(apiBasePath: string, refreshResults: any) {
  return async function deleteById(id: string) {
    try {
      const res = await fetch(`${apiBasePath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      await refreshResults()
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  };
}