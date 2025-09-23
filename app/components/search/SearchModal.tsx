// ~/components/basics/SearchModal.tsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@remix-run/react";
import SearchResultsList from "./SearchResultsList";
import { UserContext } from "~/context/UserContext";

interface SearchResult {
    id: string;
    type: "user" | "contact" | "client" | "workEntry" | "retainer";
    title: string;
    subtitle?: string;
    avatarUrl?: string;
    timezone?: string;
    remainingFunds?: number;
    currentStatus?: string;
    clientId?: string;
    userId?: string;
}

const SearchModal: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isWorkEntriesByUser, setIsWorkEntriesByUser] = useState(false)
    const user = useContext(UserContext)
    const navigate = useNavigate();

    useEffect(() => setMounted(true), []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            setOpen(prev => !prev);
        }
        if (e.key === "Escape") setOpen(false);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mounted, handleKeyDown]);

    const handleSearch = async (q: string) => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
            const data = await res.json();

            const latestRetainer = data.retainers.length > 0 ? [data.retainers[0]] : [];
            setIsWorkEntriesByUser(data.users.length > 0);

            const mapped: SearchResult[] = [
                // Solo mapear users y contacts si es admin
                ...(user?.role === "ADMIN"
                    ? data.users.map((u: any) => ({
                        id: u.id,
                        type: "user",
                        title: u.name,
                        subtitle: u.email,
                        avatarUrl: u.avatar,
                    }))
                    : []),
                ...(user?.role === "ADMIN"
                    ? data.contacts.map((c: any) => ({
                        id: c.id,
                        type: "contact",
                        title: c.name,
                        subtitle: c.email,
                        clientId: c.client_id,
                    }))
                    : []),
                // Siempre mapear clients
                ...data.clients.map((c: any) => ({
                    id: c.id,
                    type: "client",
                    title: c.company,
                    currentStatus: c.currentStatus,
                    timezone: c.timezone,
                    remainingFunds: c.remainingFunds,
                })),
                // Mapear work entries
                ...data.workEntries.map((w: any) => {
                    const formattedDate = new Date(w.billed_on).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    });
                    return {
                        id: w.id,
                        type: "workEntry",
                        title: `Work entry: ${w.hours_billed} Hours`,
                        subtitle: `${formattedDate} • ${w.client.company}`,
                        userId: w.user.id,
                        clientId: w.client.id,
                    };
                }),
                // Solo admins ven retainers
                ...(user?.role === "ADMIN"
                    ? latestRetainer.map((r: any) => {
                        const formattedDate = new Date(r.date_activated).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        });
                        return {
                            id: r.id,
                            type: "retainer",
                            title: `Last balance: $${r.amount} USD`,
                            subtitle: `activated: ${formattedDate}`,
                            clientId: r.client.id,
                        };
                    })
                    : []),
            ];

            setResults(mapped);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClickResult = (res: SearchResult, isWorkEntriesByUser: boolean) => {
        const basePath = user?.role === "ADMIN" ? "/admin" : "";

        switch (res.type) {
            case "user":
            case "contact":
                // Solo admins pueden navegar aquí
                if (user?.role === "ADMIN") {
                    navigate(`${basePath}/${res.type === "user" ? "advanced/users" : "advanced/contacts"}/${res.id}/info`);
                }
                break;
            case "client":
                navigate(`${basePath}/company/dashboard/${res.id}`);
                break;
            case "workEntry":
                if (!isWorkEntriesByUser) {
                    navigate(`${basePath}/company/work-entries/${res.clientId}`);
                } else if (res.userId) {
                    navigate(`${basePath}/user/work-entries/${res.userId}`);
                }
                break;
            case "retainer":
                // Solo admins pueden ver retainer
                if (user?.role === "ADMIN" && res.clientId) {
                    navigate(`${basePath}/company/balances/${res.clientId}`);
                }
                break;
        }
        setOpen(false);
    };

    if (!mounted) return null;

    return (
        <>
            <Input
                placeholder="Search (Ctrl+K)"
                onFocus={() => setOpen(true)}
                readOnly
                prefix={<SearchOutlined style={{ color: "#888" }} />}
                style={{ cursor: "pointer", borderRadius: "6px", width: "200px", height: "32px" }}
            />

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />
                        <div className="fixed inset-0 z-50 flex justify-center items-start pt-[15vh] pointer-events-none">
                            <motion.div
                                className="w-full max-w-lg pointer-events-auto"
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <div className="bg-white rounded-xl shadow-2xl p-4">
                                    <Input
                                        placeholder="Type to search..."
                                        autoFocus
                                        prefix={<SearchOutlined style={{ color: "#888" }} />}
                                        style={{ borderRadius: "8px", height: "40px", fontSize: "16px" }}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onPressEnter={() => handleSearch(query)}
                                    />
                                    <SearchResultsList
                                        results={results as any}
                                        loading={loading}
                                        onClickResult={(data) => handleClickResult(data, isWorkEntriesByUser)}
                                        query={query}
                                        navigate={navigate}
                                        closeModal={() => setOpen(false)}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SearchModal;