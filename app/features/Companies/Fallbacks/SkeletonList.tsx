import React from "react";
import { Skeleton } from "antd";

interface SkeletonListProps {
  count?: number;
  height?: number;
  gap?: number;
}

const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  height = 32,
  gap = 12,
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ marginBottom: gap }}>
          <Skeleton.Input style={{ width: "100%", height }} active />
        </div>
      ))}
    </>
  );
};

export default SkeletonList;