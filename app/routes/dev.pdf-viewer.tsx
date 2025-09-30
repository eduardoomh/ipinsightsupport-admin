// app/routes/dev/pdf-preview.tsx
import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { ReportUserDetail } from "~/components/pdf/interfaces/Report.interface";
import PDFView from "~/components/pdf/UserPDFView";
export default function PDFPreviewPage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    if (!isClient) return <p className="p-4">Loading preview...</p>;

    const reportUserDetail: ReportUserDetail = {
        workEntries: [
            {
                id: "cmfofaivi0007ju3yc0q8gyz7",
                billed_on: "2025-09-16T04:00:00.000Z",
                hours_billed: 0.75,
                hours_spent: 0.75,
                hourly_rate: 200,
                summary: "Worked on eBGP issue, checking BGP missing sessions with FiberX",
                rate_type: "engineering",
                client: {
                    id: "cmfoexnfu0000ju3yu6i4ujua",
                    company: "FireFi",
                },
                total_price: 150,
            },
            {
                id: "cmfofb6oo0009ju3y1slyg6la",
                billed_on: "2025-09-17T04:00:00.000Z",
                hours_billed: 0.5,
                hours_spent: 0.5,
                hourly_rate: 200,
                summary: "Checked vlan595 for the labs, it was missing on the backup port with FiberX",
                rate_type: "engineering",
                client: {
                    id: "cmfoexnfu0000ju3yu6i4ujua",
                    company: "FireFi",
                },
                total_price: 100,
            },
        ],
        managedClients: [],
    };

    return (
        <div className="w-screen h-[100dvh]">
            <PDFViewer style={{ width: '100%', height: '100vh' }}>
                <PDFView report={reportUserDetail} content={{}} metadata={{ user: "Eduardo Villasmill", startDate: "2025-09-12", endDate: "2025-09-17" }} />
            </PDFViewer>
        </div>
    );
}