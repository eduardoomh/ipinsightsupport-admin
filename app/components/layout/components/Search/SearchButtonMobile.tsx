// ~/components/basics/SearchButtonMobile.tsx
import { FC } from "react";
import { SearchOutlined } from "@ant-design/icons";

interface Props {
    onClick: () => void;
}

export const SearchButtonMobile: FC<Props> = ({ onClick }) => {
    return (
        <div className="md:hidden">
            <button
                className="p-2 rounded hover:bg-gray-200"
                onClick={onClick}
            >
                <SearchOutlined style={{ fontSize: "20px", color: "#888" }} />
            </button>
        </div>
    );
};