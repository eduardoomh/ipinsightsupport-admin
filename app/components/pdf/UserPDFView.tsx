import { Document, Page, View, Text, Image } from "@react-pdf/renderer";
import { registerMontserratFonts } from "./utils/fonts";
import RowItemV2 from "./components/RowItemV2";
//import PercentageBar from "./components/PercentageBar";
import { getRateTypeLabel } from '../../utils/general/getRateTypeLabel';
import { styles } from "./utils/styles";
import { PDFUserMetadataI } from "./interfaces/Report.interface";
import { extractFormattedContentFromHTMLv2 } from "./utils/utilities";

interface Props {
    report: any;
    content: any;
    metadata: PDFUserMetadataI;
}
export default function PDFView({ report, content, metadata }: Props) {
    registerMontserratFonts();

    const { user, startDate, endDate } = metadata;

    //const percentageWork = [
    //    { label: 'Senior Architect', percentage: 0 },
    //    { label: 'Architect', percentage: 0 },
    //    { label: 'Engineer', percentage: 100 },
    //]

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <Image
                        src="/IP-insight-support-banner_oficial.png"
                    />
                </View>

                <View style={styles.headerContainer}>
                    <Text style={styles.alert_msg_3}>
                        This user report summarizes the activities of <Text style={styles.bold_text}>{user}</Text> for the period from <Text style={styles.bold_text}>{startDate}</Text> to <Text style={styles.bold_text}>{endDate}</Text>.
                        During this time, the employee completed the following work entries:
                    </Text>
                </View>

                {/* Work Entries */}
                {report.workEntries.map((entry) => (
                    <View key={entry.id} style={styles.workEntryContainer}>
                        <RowItemV2 label="Date" value={new Date(entry.billed_on).toLocaleDateString()} />
                        <RowItemV2 label="Company" value={entry.client.company} />
                        <RowItemV2 label={"Role/Type"} value={getRateTypeLabel(entry.rate_type)} />
                        <RowItemV2 label="Hours worked" value={`${entry.hours_spent} hours`} />
                        <RowItemV2 label="Hours billed" value={`${entry.hours_billed} hours`} />
                        <RowItemV2 label="Rate per hour" value={`$${entry.hourly_rate} USD`} />
                        <RowItemV2 label="Total" value={`$${entry.total_price} USD`} />
                        {entry.summary && (
                            <Text style={styles.alert_msg_1}>{extractFormattedContentFromHTMLv2(entry.summary)}</Text>
                        )}
                    </View>
                ))}
                {/*
                <View style={styles.viewContainer}>
                    <Text style={styles.section_title}>Rate Type</Text>
                    {percentageWork.map(({ label, percentage }, idx) => (
                        <PercentageBar key={idx} label={label} percentage={percentage} />
                    ))}
                </View>
*/}
                <View style={styles.viewContainer}>
                    <Text style={styles.section_title}>Totals</Text>
                    <View style={styles.workEntryContainer}>
                        <RowItemV2 label="Hours worked" value={`${report.workEntries.reduce((total, entry) => total + entry.hours_spent, 0)} hours`} />
                        <RowItemV2 label="Hours billed" value={`${report.workEntries.reduce((total, entry) => total + entry.hours_billed, 0)} hours`} />
                        <RowItemV2 label="Total" value={`$${report.workEntries.reduce((total, entry) => total + entry.total_price, 0)} USD`} />
                    </View>
                    <Text style={styles.alert_msg_2}>
                    Report generated in <Text style={styles.bold_text}>{new Date().toLocaleDateString()}</Text>
                </Text>
                </View>
            </Page>
        </Document>
    );
}