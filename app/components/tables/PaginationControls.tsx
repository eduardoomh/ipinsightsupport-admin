import { Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { FC } from "react";

interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
}

interface PaginationControlsProps {
  currentPage: number;
  pageInfo: PageInfo;
  start: number;
  end: number;
  onPageChange: (cursor: string, direction: "next" | "prev") => void;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  pageInfo,
  start,
  end,
  onPageChange,
}) => {
  return (
    <div className="flex justify-end items-center gap-4 mt-4 select-none font-medium text-gray-700">
      <Button
        icon={<LeftOutlined />}
        onClick={() =>
          pageInfo.startCursor && onPageChange(pageInfo.startCursor, "prev")
        }
        disabled={!pageInfo.hasPreviousPage || currentPage === 1}
      />
      <span>
        {start} - {end}
      </span>
      <Button
        icon={<RightOutlined />}
        onClick={() =>
          pageInfo.endCursor && onPageChange(pageInfo.endCursor, "next")
        }
        disabled={!pageInfo.hasNextPage}
      />
    </div>
  );
};

export default PaginationControls;