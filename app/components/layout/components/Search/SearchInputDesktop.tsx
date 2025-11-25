// ~/components/basics/SearchInputDesktop.tsx
import { FC } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
    onFocus: () => void;
}

export const SearchInputDesktop: FC<Props> = ({ onFocus }) => {
    return (
        <div className="hidden md:block">
            <Input
                placeholder="Search (Ctrl+K)"
                onFocus={onFocus}
                readOnly
                prefix={<SearchOutlined style={{ color: "#888" }} />}
                style={{ cursor: "pointer", borderRadius: "6px", width: "200px", height: "32px" }}
            />
        </div>
    );
};