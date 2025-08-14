import { Card, Space } from "antd";

const SkeletonBlock = ({ height = 40 }) => (
    <div
        style={{
            width: "100%",
            height: height,
            backgroundColor: "#f0f0f0",
            borderRadius: 4,
        }}
    />
);

const ClientFormSkeleton = () => {
    return (
        <Card style={{ width: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {/* Company */}
                <SkeletonBlock height={24} />
                <SkeletonBlock height={40} />

                <SkeletonBlock height={24} />
                <SkeletonBlock height={40} />

                <SkeletonBlock height={24} />
                <SkeletonBlock height={40} />


                <SkeletonBlock height={48} />
            </Space>
        </Card>
    );
};

export default ClientFormSkeleton;