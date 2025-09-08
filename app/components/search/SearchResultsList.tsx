// ~/components/basics/SearchResultsList.tsx
import React from "react";
import { Skeleton, Avatar, Tag } from "antd";
import { UserOutlined, ShopOutlined, DollarOutlined, IdcardOutlined, FileTextOutlined } from "@ant-design/icons";
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";
import { getTimezoneLabel } from '~/utils/general/getTimezoneLabel';
import { useNavigate } from "@remix-run/react";

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

interface Props {
  results: SearchResult[];
  loading: boolean;
  onClickResult: (res: SearchResult) => void;
  query: string;
  navigate: ReturnType<typeof useNavigate>;
  closeModal: () => void;
}

const SearchResultsList: React.FC<Props> = ({ results, loading, onClickResult, query, navigate, closeModal }) => {
  if (loading) {
    return (
      <div className="mt-4 space-y-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} active paragraph={false} title={{ width: "100%" }} />
        ))}
      </div>
    );
  }

  if (!loading && results.length > 0) {
    return (
      <div className="mt-4 max-h-96 overflow-y-auto">
        {results.map((r) => (
          <div
            key={r.id + r.type}
            onClick={() => onClickResult(r)}
            className="p-2 rounded cursor-pointer flex items-center space-x-3 hover:bg-[#d9e9f1]"
          >
            {r.type === "user" && (
              <Avatar
                size={40}
                src={r.avatarUrl}
                icon={!r.avatarUrl && <UserOutlined />}
                style={{ backgroundColor: !r.avatarUrl ? "#00A2AD" : undefined }}
              />
            )}
            {r.type === "contact" && (
              <Avatar
                size={40}
                src={r.avatarUrl}
                icon={!r.avatarUrl && <IdcardOutlined />}
                style={{ backgroundColor: !r.avatarUrl ? "#FFA500" : undefined }}
              />
            )}
            {r.type === "client" && (
              <Avatar
                size={40}
                src={r.avatarUrl}
                icon={!r.avatarUrl && <ShopOutlined />}
                style={{ backgroundColor: !r.avatarUrl ? "#096584" : undefined }}
              />
            )}
            {r.type === "workEntry" && (
              <Avatar
                size={40}
                icon={<FileTextOutlined />}
                style={{ backgroundColor: "#6C757D" }}
              />
            )}
            {r.type === "retainer" && (
              <Avatar
                size={40}
                icon={<DollarOutlined />}
                style={{ backgroundColor: "#28A745" }} // verde distintivo
              />
            )}
            <div>
              <div className="font-semibold" style={{ color: "#096584" }}>
                {r.title}
              </div>
              {r.type === "client" && (
                <div className="flex flex-wrap items-center space-x-2 mt-1">
                  {r.currentStatus && <Tag color="blue">{getClientStatusLabel(r.currentStatus as any)}</Tag>}
                  {r.timezone && <span className="text-sm text-gray-500">{getTimezoneLabel(r.timezone as any)}</span>}
                  {r.remainingFunds !== undefined && (
                    <span className="text-sm text-gray-500">Funds: ${r.remainingFunds}</span>
                  )}
                </div>
              )}
              {r.subtitle && <div className="text-sm text-gray-500">{r.subtitle}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SearchResultsList;