import { Card, Col, Row, Table, Typography, Tag, Avatar, Space } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

const { Text } = Typography;

const clientMock = {
  accountManager: "Sajan Parikh",
  region: "Central/Eastern Timezone",
  mostRecentWorkEntry: "2023-01-30",
  mostRecentRetainerActivated: "2022-05-19",
  remainingFunds: "$0.00",
  rates: [
    { role: "Engineering", rate: "$275/hr" },
    { role: "Architecture", rate: "$375/hr" },
    { role: "Senior Architecture", rate: "$475/hr" },
  ],
  hoursRemaining: [
    { role: "Engineering", hours: "0.00 Hours" },
    { role: "Architecture", hours: "0.00 Hours" },
    { role: "Senior Architecture", hours: "0.00 Hours" },
  ],
  team: [
    { id: "1", name: "Alice Johnson", role: "Engineering", isLead: false },
    { id: "2", name: "Bob Smith", role: "Architecture", isLead: true },
    { id: "3", name: "Charlie Davis", role: "Senior Architecture", isLead: false },
  ],
  contacts: [
    { id: "1", name: "Hillary Crum", email: "hillary.crum@aciworldwide.com", phone: "404-923-6127" },
    { id: "2", name: "John Doe", email: "john.doe@example.com", phone: "555-123-4567" },
  ],
};

const formatDateWithAgo = (dateStr: string) => {
  const date = dayjs(dateStr);
  const diffYears = dayjs().diff(date, "year");
  return (
    <>
      {date.format("MMM DD, YYYY")}
      <br />
      <Text type="secondary">{diffYears > 0 ? `${diffYears} year${diffYears > 1 ? "s" : ""} ago` : "This year"}</Text>
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

  const ratesColumns = [
    { title: "Role", dataIndex: "role", key: "role", onHeaderCell: () => ({ style: headerCellStyle }) },
    { title: "Rate", dataIndex: "rate", key: "rate", onHeaderCell: () => ({ style: headerCellStyle }) },
  ];

  const hoursColumns = [
    { title: "Role", dataIndex: "role", key: "role", onHeaderCell: () => ({ style: headerCellStyle }) },
    { title: "Hours Remaining", dataIndex: "hours", key: "hours", onHeaderCell: () => ({ style: headerCellStyle }) },
  ];

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
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title="Información General"
            bordered
            style={{
              ...cardStyle,
              height: firstCardHeight,
              overflow: "hidden",
            }}
          >
            <p><b>Account Manager:</b> {client.accountManager}</p>
            <p><b>Region:</b> {client.region}</p>
            <p><b>Remaining Funds:</b> {client.remainingFunds}</p>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Actividad Reciente"
            bordered
            style={cardStyle}
            ref={secondCardRef}
          >
            <p><b>Most Recent Work Entry:</b> {formatDateWithAgo(client.mostRecentWorkEntry)}</p>
            <p><b>Most Recent Retainer Activated:</b> {formatDateWithAgo(client.mostRecentRetainerActivated)}</p>
          </Card>
        </Col>
      </Row>

      {
        client.team.length > 0 && (
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Team" bordered style={cardStyle}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  {client.team.map((member) => (
                    <Space key={member.id} size="middle" style={{ display: "flex", alignItems: "center" }}>
                      <Avatar>{member.name.charAt(0)}</Avatar>
                      <div>
                        <Text strong>{member.name}</Text> - <Text>{member.role}</Text>{" "}
                        {member.isLead && <Tag color="blue">Lead</Tag>}
                      </div>
                    </Space>
                  ))}
                </Space>
              </Card>
            </Col>
          </Row>
        )
      }

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Rates & Hours Remaining" bordered style={cardStyle}>
            <Table
              dataSource={
                client.rates.map((rateItem: any) => {
                  const hoursItem = client.hoursRemaining.find((h: any) => h.role === rateItem.role);
                  return {
                    role: rateItem.role,
                    rate: rateItem.rate,
                    hours: hoursItem?.hours || "N/A",
                  };
                })
              }
              columns={[
                {
                  title: "Role",
                  dataIndex: "role",
                  key: "role",
                  onHeaderCell: () => ({ style: headerCellStyle }),
                },
                {
                  title: "Rate",
                  dataIndex: "rate",
                  key: "rate",
                  onHeaderCell: () => ({ style: headerCellStyle }),
                },
                {
                  title: "Hours Remaining",
                  dataIndex: "hours",
                  key: "hours",
                  onHeaderCell: () => ({ style: headerCellStyle }),
                },
              ]}
              pagination={false}
              rowKey="role"
            />
          </Card>
        </Col>
      </Row>
      {
        client.contacts.length > 0 && (
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={24}>
              <Card title="Contacts" bordered style={cardStyle}>
                <Table dataSource={client.contacts} columns={contactsColumns} pagination={false} rowKey="id" />
              </Card>
            </Col>
          </Row>
        )
      }
    </div>
  );
};

export default DetailedClient;