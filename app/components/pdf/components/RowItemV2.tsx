import { View, Text } from "@react-pdf/renderer";
import { styles } from '../utils/styles'

const RowItemV2 = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
)
export default RowItemV2