import { Card, Col, Row, Table, Typography, Tag, Avatar, Space } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import ContentLayout from "~/components/layout/components/ContentLayout";
import DashboardLayout from "~/components/layout/DashboardLayout";
import DashboardItem from "../detailedClients/DashboardItem";
import TeamMember from "../detailedClients/utils/TeamMember";

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

const cardStyle = {
  border: "1px solid #cacaca", // borde gris más fuerte
  borderRadius: 0,
};

const headerCellStyle = {
  backgroundColor: "#01ABE8",
  color: "white",
  fontWeight: 600,
};

interface Props {
  client: any;
}

const DetailedClient: React.FC<Props> = ({ client }) => {
  const [firstCardHeight, setFirstCardHeight] = useState<number | undefined>(undefined);
  const secondCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (secondCardRef.current) {
      setFirstCardHeight(secondCardRef.current.offsetHeight);
    }
  }, []);

  const contactsColumns = [
    { title: "Name", dataIndex: "name", key: "name", onHeaderCell: () => ({ style: headerCellStyle }) },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      onHeaderCell: () => ({ style: headerCellStyle }),
      render: (email: string) => <a href={`mailto:${email}`}>{email}</a>,
    },
    { title: "Phone", dataIndex: "phone", key: "phone", onHeaderCell: () => ({ style: headerCellStyle }) },
  ];

  return (
    <>
      <ContentLayout title="Profile" type="basic_section" size="small">
        <Row>
          <Col span={12}>
            <DashboardItem
              label="Region"
              value={client.region}
              showBorder={true}
            />
            <DashboardItem
              label="Remaining funds"
              value={client.remainingFunds}
              showBorder={true}
            />
            <DashboardItem
              label="Account manager"
              value={client.accountManager}
            />
          </Col>
          <Col span={12}>
            <DashboardItem
              label="Most Recent Work Entry"
              value={formatDateWithAgo(client.mostRecentWorkEntry)}
              showBorder={true}
            />
            <DashboardItem
              label="Most Recent Retainer Activate"
              value={formatDateWithAgo(client.mostRecentRetainerActivated)}
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
              client.rates.map((rateItem: any) => {
                const hoursItem = client.hoursRemaining.find((h: any) => h.role === rateItem.role);
                return (
                  <DashboardItem
                    label={rateItem.role}
                    value={`${rateItem.rate} - ${hoursItem?.hours || "N/A"} remaining`}
                    showBorder={true}
                  />
                )
              })
            }
          </ContentLayout>
        </Col>
        <Col span={12}>
          <ContentLayout title="Team members" type="basic_section" size="small">
            {client.team.map((member) => (
              <TeamMember
                name={member.name}
                role={member.role}
                isLead={member.isLead}
                showBorder={true}
              />
            ))}
          </ContentLayout>
        </Col>
      </Row>
      <br />
      <ContentLayout title="Contacts" type="basic_section" size="small">
        {client.contacts.map((contact) => (
          <TeamMember
            name={contact.name}
            role={contact.email}
            isLead={false}
            showBorder={true}
          />
        ))}
      </ContentLayout>
      <br/>
    </>
  );
};

export default DetailedClient;