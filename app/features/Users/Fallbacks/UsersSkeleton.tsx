export default function UsersSkeleton() {
    return (
        <div className="overflow-x-auto relative">
            <table className="min-w-full border border-gray-300 rounded-md shadow-sm text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Phone</th>
                        <th className="px-4 py-3 text-left">Admin</th>
                        <th className="px-4 py-3 text-left">Active</th>
                        <th className="px-4 py-3 text-left">Manager</th>
                         <th className="px-4 py-3 text-left">Created At</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <tr key={i} className="border-t animate-pulse">
                            {Array.from({ length: 8 }).map((_, j) => (
                                <td key={j} className="px-4 py-4">
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}