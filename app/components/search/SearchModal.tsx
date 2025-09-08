// ~/components/basics/SearchModal.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@remix-run/react";
import SearchResultsList from "./SearchResultsList";

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
}

const SearchModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
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

      const mapped: SearchResult[] = [
        ...data.users.map((u: any) => ({
          id: u.id,
          type: "user",
          title: u.name,
          subtitle: u.email,
          avatarUrl: u.avatar,
        })),
        ...data.contacts.map((c: any) => ({
          id: c.id,
          type: "contact",
          title: c.name,
          subtitle: c.email,
          clientId: c.client_id,
        })),
        ...data.clients.map((c: any) => ({
          id: c.id,
          type: "client",
          title: c.company,
          currentStatus: c.currentStatus,
          timezone: c.timezone,
          remainingFunds: c.remainingFunds,
        })),
        ...data.workEntries.map((w: any) => ({
          id: w.id,
          type: "workEntry",
          title: w.summary,
          subtitle: `${w.client.company} • ${w.user.name}`
        })),
        ...latestRetainer.map((r: any) => {
          const formattedDate = new Date(r.date_activated).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          return {
            id: r.id,
            type: "retainer",
            title: `Last retainer: $${r.amount} USD`,
            subtitle: `activated: ${formattedDate}`,
            clientId: r.client.id,
          };
        }),
      ];

      setResults(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClickResult = (res: SearchResult) => {
    switch (res.type) {
      case "user":
        navigate(`/admin/advanced/users/${res.id}/info`);
        break;
      case "contact":
        navigate(`/admin/advanced/contacts/${res.id}/info`);
        break;
      case "client":
        navigate(`/admin/company/dashboard/${res.id}`);
        break;
      case "workEntry":
        navigate(`/work-entries/${res.id}`);
        break;
      case "retainer":
        if (res.clientId) navigate(`/admin/company/retainers/${res.clientId}`);
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
                    onClickResult={handleClickResult}
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