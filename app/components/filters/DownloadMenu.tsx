// components/work-entries/DownloadButton.tsx
import { Button, Dropdown, Menu } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface Props {
  path: string;
  fileName: string;
  selectedFilter: "recent" | "date" | null;
  dateRange: [Date | null, Date | null] | null;
  isCredit?: boolean | null;
  companyStatus?: string | null;
  clientId?: string | null; // <-- nuevo
  userId?: string | null;   // <-- nuevo
}

export default function DownloadButton({
  selectedFilter,
  dateRange,
  path,
  fileName,
  isCredit,
  companyStatus,
  clientId, // <-- nuevo
  userId,   // <-- nuevo
}: Props) {

  const buildUrl = (format: "csv" | "xlsx") => {
    const base = import.meta.env.VITE_APP_URL || window.location.origin;
    let url = `${base}${path}/export/${format}`;
  
    const params = new URLSearchParams();

    // Filtro por fechas o recientes
    if (selectedFilter === "date" && dateRange?.[0] && dateRange?.[1]) {
      params.set("filter", "date");
      params.set("from", dateRange[0].toISOString().split("T")[0]);
      params.set("to", dateRange[1].toISOString().split("T")[0]);
    } else if (selectedFilter === "recent") {
      params.set("filter", "recent");
    }

    // Filtro crédito/débito
    if (isCredit !== undefined && isCredit !== null) {
      params.set("is_credit", isCredit ? "true" : "false");
    }

    // Filtro estado de la compañía
    if (companyStatus) {
      params.set("currentStatus", companyStatus);
    }

    // Filtro por compañía
    if (clientId) {
      params.set("client_id", clientId);
    }

    // Filtro por usuario
    if (userId) {
      params.set("user_id", userId);
    }
  
    return `${url}?${params.toString()}`;
  };

  const downloadFile = async (format: "csv" | "xlsx") => {
    try {
      const res = await fetch(buildUrl(format));
      if (!res.ok) throw new Error("Error al descargar archivo");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.${format}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error(err);
      alert("No se pudo descargar el archivo");
    }
  };

  const menu = (
    <Menu
      items={[
        {
          key: "csv",
          label: "Descargar CSV",
          onClick: () => downloadFile("csv"),
        },
        {
          key: "xlsx",
          label: "Descargar XLSX",
          onClick: () => downloadFile("xlsx"),
        },
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button icon={<DownloadOutlined />}>Descargar</Button>
    </Dropdown>
  );
}