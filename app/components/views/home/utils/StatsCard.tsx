import { Card, Statistic, Skeleton } from "antd";
import { FC } from "react";
import { BarChartOutlined } from '@ant-design/icons';

interface Props {
    label: string;
    value: number;
    loading?: boolean;
}

const StatsCard: FC<Props> = ({ label, value, loading = false }) => {
    return (
        <Card 
            style={{ 
                border: "1px solid #d3d3d3", 
                marginBottom: '16px', 
                minHeight: 150, 
                maxHeight: 200, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: 8,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
        >
            {loading ? (
                <Skeleton active paragraph={false} title={{ width: '60%' }} />
            ) : (
                <div className="flex items-center gap-2">
                    <BarChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                    <Statistic
                        title={<span style={{ color: "#014a64", fontWeight: 'bold' }}>{label}</span>}
                        value={value}
                    />
                </div>
            )}
        </Card>
    );
};

export default StatsCard;