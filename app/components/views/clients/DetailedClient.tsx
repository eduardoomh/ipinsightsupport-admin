import { Col, Row, Typography, Avatar } from "antd";
import dayjs from "dayjs";
import React from "react";
import ContentLayout from "~/components/layout/components/ContentLayout";
import DashboardItem from "../detailedClients/DashboardItem";
import { ClientI } from "~/interfaces/clients.interface";
import RatesSection from "./components/RatesSection";
import TeamMembersSection from "./components/TeamMemberSection";
import ContactsSection from "./components/ContactSection";
import ClientStatusHistorySection from "./components/ClientStatusHistorySection";
import { getTimezoneLabel } from "~/utils/general/getTimezoneLabel";

const { Text } = Typography;

const formatDateWithAgo = (dateStr: string) => {
  if (!dateStr) return "—";
  const date = dayjs(dateStr);
  const diffYears = dayjs().diff(date, "year");
  return (
    <>
      {date.format("MMM DD, YYYY")}
      <br />
      <Text type="secondary">{diffYears > 0 ? `${diffYears} year${diffYears > 1 ? "s" : ""} ago` : ""}</Text>
    </>
  );
};

interface Props {
  client: ClientI;
}

const DetailedClient: React.FC<Props> = ({ client }) => {
  return (
    <>
      <ContentLayout title="Profile" type="basic_section" size="small">
        <Row>
          <Col span={12}>
            <DashboardItem label="Region" value={getTimezoneLabel(client.timezone as any)} showBorder={true} />
            <DashboardItem label="Remaining funds" value={`$${client.remainingFunds}`} showBorder={true} />
            <DashboardItem
              label="Account manager"
              value={
                client?.account_manager ? (
                  <>
                    <span style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 4, marginTop: 4 }}>
                      <Avatar
                        size="small"
                        src={client.account_manager.avatar || undefined}
                        style={{ backgroundColor: "#7f8fa6" }} // gris azulado
                      >
                        {client.account_manager.name[0]}
                      </Avatar>
                      <span>{client.account_manager.name}</span>
                    </span>
                  </>
                ) : (
                  'No asignado'
                )
              }
            />
          </Col>
          <Col span={12}>
            <DashboardItem label="Most Recent Work Entry" value={formatDateWithAgo(client.most_recent_work_entry)} showBorder={true} />
            <DashboardItem label="Most Recent Retainer Activated" value={formatDateWithAgo(client.most_recent_retainer_activated)} showBorder={true} />
            <DashboardItem label="Created" value={formatDateWithAgo(client.createdAt)} />
          </Col>
        </Row>
      </ContentLayout>

      <br />
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <RatesSection client={client} />
          <br/>
          <ContactsSection client={client} />
        </Col>
        <Col span={12}>
          <TeamMembersSection client={client} />
          <br/>
          <ClientStatusHistorySection clientId={client.id} />
        </Col>
      </Row>
      <br />

    </>
  );
};

export default DetailedClient;