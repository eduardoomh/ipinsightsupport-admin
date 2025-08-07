// utils/hooks/useDeleteResource.ts
export function useDeleteResource(apiBasePath: string) {
  return async function deleteById(id: string) {
    try {
      const res = await fetch(`${apiBasePath}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error("Delete error:", err);
      throw err;
    }
  };
}