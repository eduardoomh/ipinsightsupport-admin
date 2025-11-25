// ~/components/basics/SearchResultsModal.tsx
import { FC } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

import { SearchResult } from "~/interfaces/search.interface";
import SearchResultsList from "~/components/search/SearchResultsList";

interface Props {
    open: boolean;
    query: string;
    setQuery: (q: string) => void;
    loading: boolean;
    results: SearchResult[];
    isWorkEntriesByUser: boolean;
    closeModal: () => void;
    onSearch: (q: string) => void;
    navigate: any;
}

export const SearchResultsModal: FC<Props> = ({
    open,
    query,
    setQuery,
    loading,
    results,
    isWorkEntriesByUser,
    closeModal,
    onSearch,
    navigate,
}) => {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
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
                                    onPressEnter={() => onSearch(query)}
                                />
                                <SearchResultsList
                                    results={results}
                                    loading={loading}
                                    onClickResult={(data: SearchResult) => navigate(data, isWorkEntriesByUser)}
                                    query={query}
                                    navigate={navigate}
                                    closeModal={closeModal}
                                />
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};