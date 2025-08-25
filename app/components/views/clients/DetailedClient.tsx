import { Col, Row, Typography } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import ContentLayout from "~/components/layout/components/ContentLayout";
import DashboardItem from "../detailedClients/DashboardItem";
import TeamMember from "../detailedClients/utils/TeamMember";
import { ClientI } from "~/interfaces/clients.interface";
import { getRateTypeLabel, RateType } from "~/utils/general/getRateTypeLabel";

const { Text } = Typography;

const formatDateWithAgo = (dateStr: string) => {
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
            <DashboardItem
              label="Region"
              value={client.timezone}
              showBorder={true}
            />
            <DashboardItem
              label="Remaining funds"
              value={`$${client.remainingFunds}`}
              showBorder={true}
            />
            <DashboardItem
              label="Account manager"
              value={client?.account_manager?.name || 'Np asignado'}
            />
          </Col>
          <Col span={12}>
            <DashboardItem
              label="Most Recent Work Entry"
              value={formatDateWithAgo(client.most_recent_work_entry)}
              showBorder={true}
            />
            <DashboardItem
              label="Most Recent Retainer Activate"
              value={formatDateWithAgo(client.most_recent_retainer_activated)}
              showBorder={true}
            />
            <DashboardItem
              label="Created"
              value={formatDateWithAgo(client.createdAt)}
            />
          </Col>
        </Row>
      </ContentLayout>
      <br />
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ContentLayout title="Rates" type="basic_section" size="small">

            {
              [
                {
                  rate: client?.rates?.engineeringRate || '0',
                  role: 'Engineering',
                  estimated: client?.estimated_engineering_hours || '0'
                },
                {
                  rate: client.rates?.architectureRate || '0',
                  role: 'Architecture',
                  estimated: client?.estimated_architecture_hours || '0'
                },
                {
                  rate: client.rates?.seniorArchitectureRate || '0',
                  role: 'Senior architecture',
                  estimated: client?.estimated_senior_architecture_hours || '0'
                }
              ].map((rateItem: any) => {
                return (
                  <DashboardItem
                    label={rateItem.role}
                    value={`$${rateItem.rate}/hr (${rateItem.estimated}/hrs remaining)`}
                    showBorder={true}
                  />
                )
              })
            }
          </ContentLayout>
        </Col>
        <Col span={12}>
          <ContentLayout title="Team members" type="basic_section" size="small">
            {
              client.team_members.length > 0 ?
                client.team_members.map((member) => (
                  <TeamMember
                    name={member.user.name}
                    role={getRateTypeLabel(member.rate_type as RateType)}
                    isLead={member.role === "technical_lead"}
                    showBorder={true}
                  />
                )) : <p>There are no team members assigned yet.</p>
            }
          </ContentLayout>
        </Col>
      </Row>
      <br />
      <ContentLayout title="Contacts" type="basic_section" size="small">
        {
          client.contacts.length > 0 ?
            client.contacts.map((contact) => (
              <TeamMember
                name={contact.name}
                role={contact.email}
                isLead={false}
                showBorder={true}
              />
            )) : <p>There are no contacts yet.</p>
        }
      </ContentLayout>
      <br />
    </>
  );
};

export default DetailedClient;