// components/work-entries/header-actions/TimeFilter.tsx
import { Segmented, DatePicker, Typography } from "antd";
import { CalendarOutlined, FilterOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface Props {
    selectedFilter: "recent" | "date" | null;
    setSelectedFilter: (val: "recent" | "date" | null) => void;
    dateRange: [Dayjs, Dayjs] | null;
    setDateRange: (val: [Dayjs, Dayjs] | null) => void;
}

export const DateFilter = ({ selectedFilter, setSelectedFilter, dateRange, setDateRange }: Props) => {
    return (
        <div className="bg-white">
            <Text strong className="block mb-3 text-gray-700 text-base">
                <CalendarOutlined className="mr-2 text-blue-500" /> Period
            </Text>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <Segmented
                    block
                    size="large"
                    options={[
                        { label: 'Recent (Latest)', value: 'recent', icon: <FilterOutlined /> },
                        { label: 'By Date', value: 'date', icon: <CalendarOutlined /> },
                    ]}
                    value={selectedFilter || 'recent'}
                    onChange={(val) => setSelectedFilter(val as "recent" | "date")}
                    className="mb-3"
                />

                {selectedFilter === "date" && (
                    <RangePicker
                        value={dateRange}
                        onChange={(dates) => setDateRange(dates ? [dates[0], dates[1]] : null)}
                        style={{ width: "100%" }}
                        size="middle"
                        placeholder={['Start date', 'End Date']}
                    />
                )}
            </div>
        </div>
    );
};