// CompanyActions.tsx
import { useEffect, useState } from "react";
import { Button, Dropdown, Menu, message } from "antd";
import { MailOutlined, DownloadOutlined } from "@ant-design/icons";
import { handleDownloadPDF, generateCompanyPDFDoc } from "~/components/pdf/handleDownloadCompanyPDF";
import { ReportCompanyI } from "~/components/pdf/interfaces/Report.interface";
import { pdf } from "@react-pdf/renderer"; // 👈 necesario para generar PDF en memoria
import { CompanyReportI } from "./utils/companyReport.interface";

interface Props {
  record: CompanyReportI;
  from: string;
  to: string;
}

const CompanyActions: React.FC<Props> = ({ record, from, to }) => {
  const [contacts, setContacts] = useState<{ key: string; label: string }[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(`/api/contacts?take=6&client_id=${record.id}`);
        if (!res.ok) throw new Error("Error fetching contacts");
        const data = await res.json();

        setContacts(
          data.contacts.map((c: any) => ({
            key: c.email,
            label: c.name,
          }))
        );
      } catch (err) {
        console.error(err);
        message.error("Failed to load contacts");
      }
    };

    fetchContacts();
  }, [record.id]);

  const handleGenerate = async () => {
    try {
      const res = await fetch(
        `/api/clients/report?client_id=${record.id}&from=${from}&to=${to}`
      );
      if (!res.ok) throw new Error("Error fetching report");

      const data = await res.json();

      handleDownloadPDF(data as ReportCompanyI, data, {
        company: record.company,
        startDate: from,
        endDate: to,
      });
      message.success(`Report downloaded successfully`);
    } catch (err) {
      console.error(err);
      message.error("Failed to generate report");
    }
  };

  const handleSend = async (contact: string) => {
    try {
      const res = await fetch(
        `/api/clients/report?client_id=${record.id}&from=${from}&to=${to}`
      );
      if (!res.ok) throw new Error("Error fetching report");

      const data = await res.json();

      // 1️⃣ Generar el PDF en memoria con react-pdf
      const doc = generateCompanyPDFDoc(data as ReportCompanyI, data, {
        company: record.company,
        startDate: from,
        endDate: to,
      });

      const blob = await pdf(doc).toBlob();

      // 2️⃣ Convertir a Base64
      const base64 = await blobToBase64(blob);

      // 3️⃣ Mandar al backend
      const sendRes = await fetch(`/api/clients/send-report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: contact,
            pdfBase64: base64,
            filename: `${record.company}_report.pdf`,
            company: record.company,
            startDate: from,
            endDate: to,
          }),
      });

      if (!sendRes.ok) throw new Error("Error sending report");

      message.success(`Report sent to ${contact}`);
    } catch (err) {
      console.error(err);
      message.error("Failed to send report");
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject("Failed to convert blob");
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const menu = (
    <Menu
      onClick={({ key }) => handleSend(key)}
      items={contacts.map((c) => ({
        key: c.key,
        label: c.label,
        icon: <MailOutlined />,
      }))}
    />
  );

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <Button
        type="primary"
        className="bg-primary"
        icon={<DownloadOutlined />}
        onClick={handleGenerate}
      >
        Generate Report
      </Button>

      <Dropdown overlay={menu} trigger={["click"]}>
        <Button icon={<MailOutlined />}>Send Report To</Button>
      </Dropdown>
    </div>
  );
};

export default CompanyActions;