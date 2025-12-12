import { Button, Tooltip } from "antd";
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
  isLoading?: boolean; 
}

const PaginationControls: FC<PaginationControlsProps> = ({
  currentPage,
  pageInfo,
  start,
  end,
  onPageChange,
  isLoading = false,
}) => {
  return (
    <div className="flex justify-end items-center gap-4 mt-4 select-none">

      <div className="text-sm text-gray-400 font-medium tracking-wide">
       <span className="text-gray-900 font-semibold">{start}</span> - <span className="text-gray-900 font-semibold">{end}</span>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip title="Anterior">
            <Button
                type="text"
                shape="circle"
                size="middle"
                icon={<LeftOutlined style={{ fontSize: '12px' }} />}
                onClick={() => pageInfo.startCursor && onPageChange(pageInfo.startCursor, "prev")}
                disabled={!pageInfo.hasPreviousPage || currentPage === 1 || isLoading}
                className={`
                    flex items-center justify-center 
                    hover:bg-gray-100 text-gray-600
                    ${(!pageInfo.hasPreviousPage || currentPage === 1) ? 'opacity-30' : ''}
                `}
            />
        </Tooltip>

        <Tooltip title="Siguiente">
            <Button
                type="text"
                shape="circle"
                size="middle"
                icon={<RightOutlined style={{ fontSize: '12px' }} />}
                onClick={() => pageInfo.endCursor && onPageChange(pageInfo.endCursor, "next")}
                disabled={!pageInfo.hasNextPage || isLoading}
                className={`
                    flex items-center justify-center 
                    hover:bg-gray-100 text-gray-600
                    ${!pageInfo.hasNextPage ? 'opacity-30' : ''}
                `}
            />
        </Tooltip>
      </div>
    </div>
  );
};

export default PaginationControls;