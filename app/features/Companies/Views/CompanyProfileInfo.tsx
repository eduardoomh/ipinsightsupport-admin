// ContactProfileInfo.tsx
import { Descriptions } from "antd";
import { ClientI } from "~/interfaces/clients.interface";
import { getTimezoneLabel } from '../../../utils/general/getTimezoneLabel';
import { getClientStatusLabel } from "~/utils/general/getClientStatusLabel";

interface CompanyProfileInfoProps {
    company: ClientI;
}

export const CompanyProfileInfo = ({ company }: CompanyProfileInfoProps) => {
    return (
        <Descriptions
            column={1}
            bordered
            size="small"
            layout="horizontal"
            labelStyle={{ width: "33%", fontWeight: 500 }}
            contentStyle={{ width: "66%" }}
            style={{ borderColor: "#d9d9d9" }}
            className="custom-descriptions"
        >
            <Descriptions.Item label="Timezone">{getTimezoneLabel(company.timezone as any) || "-"}</Descriptions.Item>
            <Descriptions.Item label="Status">{getClientStatusLabel(company.currentStatus as any) || "-"}</Descriptions.Item>
            <Descriptions.Item label="Created At">
                {company.createdAt ? new Date(company.createdAt).toLocaleString() : "-"}
            </Descriptions.Item>
        </Descriptions>
    );
};