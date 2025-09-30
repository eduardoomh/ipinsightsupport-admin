import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
    page: {
        padding: '16px 24px',
        fontFamily: 'Montserrat',
    },
    headerContainer: {
        marginBottom: 20,
        textAlign: "center" as const,
    },
    title: { color: '#1790c1', fontSize: 20, marginBottom: 4, fontWeight: '600' },
    subTitle: { fontSize: 12, marginBottom: 15 },
    short_text: { fontSize: 8, color: 'gray', fontWeight: '600' },
    general_text: { fontSize: 10, color: 'black', marginBottom: 4, fontWeight: '500' },
    center_text: { fontSize: 10, color: 'black', marginBottom: 4, fontWeight: '500', textAlign: 'center' },
    section_title: { color: '#1790c1', fontSize: 14, marginBottom: 4, fontWeight: '600', textAlign: 'center' },
    section_title_2: { color: '#1790c1', fontSize: 14, fontWeight: '600' },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "bold" as const,
        marginBottom: 8,
        marginTop: 12,
    },
    alert_msg_1: {
        backgroundColor: '#D6EBF0',
        color: '#255365',
        padding: 8,
        fontSize: 8,
        marginTop: 6,
        marginBottom: 4,
        fontWeight: '500',
        borderRadius: 2,
    },
    alert_msg_2: {
        backgroundColor: '#FAF1DB',
        color: '#83622D',
        padding: 8,
        fontSize: 8,
        marginBottom: 4,
        marginTop: 4,
        fontWeight: '500',
        borderRadius: 2,
        textAlign: 'center'
    },
    alert_msg_3: {
        backgroundColor: '#EDECEC',
        color: '#544D5F',
        padding: 8,
        marginTop: 6,
        fontSize: 10,
        marginBottom: 4,
        fontWeight: '500',
        borderRadius: 2,
    },
    workEntryContainer: {
        marginBottom: 24
    },
    workEntryText: {
        marginBottom: 2,
    },
    clientList: {
        marginTop: 5,
        paddingLeft: 10,
    },
    container: { display: 'flex', flexDirection: 'row', marginTop: 16, gap: 32 },
    viewContainer: { margin: '6px 0' },
    bold_text: { fontWeight: 'bold' },
    bold: { fontWeight: 700 },
    italic: { fontStyle: 'italic' },
    label: { fontSize: 9, fontWeight: 'bold' },
    value: { fontSize: 9, fontWeight: '500' },
    list_item_text: { fontSize: 8, color: 'black', fontWeight: '500', marginBottom: 2 },
    list_bullet: { fontSize: 12, marginRight: 6, lineHeight: 1.2 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottom: '1 solid #ccc',
        paddingVertical: 4
    },
});