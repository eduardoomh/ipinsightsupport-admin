import { Col, Row, Avatar, Alert } from "antd";
import React from "react";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { ClientI } from "~/interfaces/clients.interface";
import { getTimezoneLabel } from "~/utils/general/getTimezoneLabel";
import DateUsFormat from "~/components/tables/DateUsFormat";
import DashboardItem from "~/features/Companies/Components/DashboardItem";
import RatesSection from "~/features/Companies/Components/RatesSection";
import ContactsSection from "~/features/Companies/Components/ContactSection";
import TeamMembersSection from "~/features/Companies/Components/TeamMemberSection";
import ClientStatusHistorySection from "~/features/Companies/Components/ClientStatusHistorySection";

interface Props {
  client: ClientI;
}

const DetailedClient: React.FC<Props> = ({ client }) => {
  return (
    <>
      <ContentLayout title="Profile" type="basic_section" size="small">
      {
        client && client?.billing_type === "MONTHLY_PLAN" && (
          <Alert
            message="This company has monthly plan"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )
      }
        <Row>
          <Col xs={24} sm={24} md={12} lg={12}>
            <DashboardItem label="Region" value={getTimezoneLabel(client.timezone as any)} showBorder={true} />
            <DashboardItem 
              label={"Remaining funds"} 
              value={ client?.billing_type === "MONTHLY_PLAN" ? "Monthly plan" : `$${client.remainingFunds}`} 
              showBorder={true} 
            />
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
          <Col xs={24} sm={24} md={12} lg={12}>
            <DashboardItem label="Most Recent Work Entry" value={<DateUsFormat date={client.most_recent_work_entry} />} showBorder={true} />
            <DashboardItem label="Most Recent Balance Activated" value={<DateUsFormat date={client.most_recent_retainer_activated} />} showBorder={true} />
            <DashboardItem label="Created" value={<DateUsFormat date={client.createdAt} />} />
          </Col>
        </Row>
      </ContentLayout>

      <br />
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <RatesSection client={client} />
          <br/>
          <ContactsSection client={client} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
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