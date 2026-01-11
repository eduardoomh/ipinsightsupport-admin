export default function BalancesSkeleton() {
    return (
        <div className="overflow-x-auto relative">
            <table className="min-w-full border border-gray-300 rounded-md shadow-sm text-sm">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-3 text-left">Company</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Activated On</th>
                        <th className="px-4 py-3 text-left">Expires On</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <tr key={i} className="border-t animate-pulse">
                            {Array.from({ length: 6 }).map((_, j) => (
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