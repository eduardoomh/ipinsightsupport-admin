// utils/pdfHelpers.tsx
import { pdf } from "@react-pdf/renderer";
import { PDFContentI } from "./interfaces/Content.interface"; 
import { PDFCompanyrMetadataI } from "./interfaces/Report.interface";
import CompanyPDFView from "./CompanyPDFView";

export const handleDownloadPDF = async (report: any, content: PDFContentI, metadata: PDFCompanyrMetadataI) => {
  const blob = await pdf(
    <CompanyPDFView report={report} content={content} metadata={metadata} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${metadata.company} - ${metadata.startDate} - ${metadata.endDate}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
};

export const generateCompanyPDFDoc = (
    report: any,
    content: PDFContentI,
    metadata: PDFCompanyrMetadataI
  ) => {
    return <CompanyPDFView report={report} content={content} metadata={metadata} />;
  };
  