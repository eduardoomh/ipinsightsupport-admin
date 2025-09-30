import { View, Text } from "@react-pdf/renderer";

const PercentageBar = ({ label, percentage }: { label: string; percentage: number }) => (
    <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            paddingBottom: 8,
            borderBottom: '0.5 solid #ccc',
            gap: 8,
        }}
    >
        <Text style={{ fontSize: 8, fontWeight: 600, width: 80 }}>{label}</Text>
        <View
            style={{
                flex: 1,
                height: 12,
                backgroundColor: '#e0e0e0',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <View
                style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: '#1790c1',
                    justifyContent: 'center',
                    alignItems: percentage > 10 ? 'center' : 'flex-start',
                    paddingLeft: 4,
                }}
            >
                {percentage > 0 && (
                    <Text style={{ fontSize: 6, color: 'white', fontWeight: 600 }}>{percentage}%</Text>
                )}
            </View>
        </View>
    </View>
)


export default PercentageBar