// ~/components/basics/SearchModal.tsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "@remix-run/react";
import { UserContext } from "~/context/UserContext";
import { UserRole } from "~/features/Users/Interfaces/users.interface";
import { SearchResult, SearchType } from "~/interfaces/search.interface";
import { SearchInputDesktop } from "../layout/components/Search/SearchInputDesktop";
import { SearchButtonMobile } from "../layout/components/Search/SearchButtonMobile";
import { SearchResultsModal } from "../layout/components/Search/SearchResultsModal";

const SearchModal: React.FC<{ role: UserRole }> = ({ role }) => {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isWorkEntriesByUser, setIsWorkEntriesByUser] = useState(false);
    const user = useContext(UserContext);
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
                ...(user?.role === UserRole.ADMIN
                    ? data.users.map((u: any) => ({
                        id: u.id,
                        type: SearchType.User,
                        title: u.name,
                        subtitle: u.email,
                        avatarUrl: u.avatar,
                    }))
                    : []),
                ...(user?.role === UserRole.ADMIN
                    ? data.contacts.map((c: any) => ({
                        id: c.id,
                        type: SearchType.Contact,
                        title: c.name,
                        subtitle: c.email,
                        clientId: c.client_id,
                    }))
                    : []),
                ...data.clients.map((c: any) => ({
                    id: c.id,
                    type: SearchType.Client,
                    title: c.company,
                    currentStatus: c.currentStatus,
                    timezone: c.timezone,
                    remainingFunds: c.remainingFunds,
                })),
                ...data.workEntries.map((w: any) => {
                    const formattedDate = new Date(w.billed_on).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    });
                    return {
                        id: w.id,
                        type: SearchType.WorkEntry,
                        title: `Work entry: ${w.hours_billed} Hours`,
                        subtitle: `${formattedDate} • ${w.client.company}`,
                        userId: w.user.id,
                        clientId: w.client.id,
                    };
                }),
                ...(user?.role === UserRole.ADMIN
                    ? latestRetainer.map((r: any) => {
                        const formattedDate = new Date(r.date_activated).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        });
                        return {
                            id: r.id,
                            type: SearchType.Retainer,
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
        const basePath = user?.role === UserRole.ADMIN ? "/admin" : "";

        switch (res.type) {
            case SearchType.User:
            case SearchType.Contact:
                if (user?.role === UserRole.ADMIN) {
                    navigate(`${basePath}/${res.type === SearchType.User ? "advanced/users" : "advanced/contacts"}/${res.id}/info`);
                }
                break;
            case SearchType.Client:
                navigate(`${basePath}/company/dashboard/${res.id}`);
                break;
            case SearchType.WorkEntry:
                if (!isWorkEntriesByUser) {
                    navigate(`${basePath}/company/work-entries/${res.clientId}`);
                } else if (res.userId) {
                    navigate(`${basePath}/user/work-entries/${res.userId}`);
                }
                break;
            case SearchType.Retainer:
                if (user?.role === UserRole.ADMIN && res.clientId) {
                    navigate(`${basePath}/company/balances/${res.clientId}`);
                }
                break;
        }
        setOpen(false);
    };

    if (!mounted || role === UserRole.CLIENT) return null;

    return (
        <>
            <SearchInputDesktop onFocus={() => setOpen(true)} />
            <SearchButtonMobile onClick={() => setOpen(true)} />
            <SearchResultsModal
                open={open}
                query={query}
                setQuery={setQuery}
                loading={loading}
                results={results}
                isWorkEntriesByUser={isWorkEntriesByUser}
                closeModal={() => setOpen(false)}
                onSearch={handleSearch}
                navigate={handleClickResult}
            />
        </>
    );
};

export default SearchModal;