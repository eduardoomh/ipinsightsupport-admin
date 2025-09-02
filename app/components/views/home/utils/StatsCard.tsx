import { Card, Statistic, Skeleton } from "antd";
import { FC } from "react";

interface Props {
    label: string;
    value: number;
    loading?: boolean; // <-- nueva prop
}

const StatsCard: FC<Props> = ({ label, value, loading = false }) => {
    return (
        <Card style={{ border: "1px solid #d3d3d3", marginBottom: '16px' }}>
            {loading ? (
                <Skeleton active paragraph={false} title={{ width: '60%' }} />
            ) : (
                <Statistic
                    title={<span style={{ color: "#014a64", fontWeight: 'bold' }}>{label}</span>}
                    value={value}
                />
            )}
        </Card>
    );
};

export default StatsCard;