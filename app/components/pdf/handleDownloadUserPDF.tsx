// utils/pdfHelpers.tsx
import { pdf } from "@react-pdf/renderer";
import UserPDFView from "./UserPDFView";
import { PDFContentI } from "./interfaces/Content.interface"; 
import { PDFUserMetadataI } from "./interfaces/Report.interface";

export const handleDownloadPDF = async (report: any, content: PDFContentI, metadata: PDFUserMetadataI) => {
  const blob = await pdf(
    <UserPDFView report={report} content={content} metadata={metadata} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${metadata.user} - ${metadata.startDate} - ${metadata.endDate}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};