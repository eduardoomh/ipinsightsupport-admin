import { Table, TableColumnsType, Tag, Avatar, Space } from "antd";
import { FC } from "react";
import dayjs from "dayjs";
import { ClientI } from "~/interfaces/clients.interface";
import { useNavigate } from "@remix-run/react";

interface DataType {
  id: string;
  company: string;
  team_members: ClientI["team_members"];
  most_recent_work_entry: string;
  most_recent_retainer_activated: string;
}

interface Props {
  clients: ClientI[];
}

const ClientsAdminTable: FC<Props> = ({ clients }) => {
  const navigate = useNavigate();

  const columns: TableColumnsType<DataType> = [
    {
      title: "Company",
      dataIndex: "company",
      render: (_, record) => (
        <span
          style={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => navigate(`/admin/detailed-client/${record.id}`)}
        >
          {record.company}
        </span>
      ),
    },
    {
      title: "Team",
      dataIndex: "team_members",
      render: (_, record) => {
        if (!record.team_members || record.team_members.length === 0) {
          return <span> - </span>;
        }

        return (
          <div>
            {record.team_members.map((tm, index) => {
              const name = tm.user?.name || "—";
              return (
                <div key={index} style={{ marginBottom: 8 }}>
                  <Space size="middle">
                    <Avatar style={{ backgroundColor: "#1890ff" }}>
                      {name.charAt(0).toUpperCase()}
                    </Avatar>
                    <span>{name}</span>
                    {tm.role === "technical_lead" && (
                      <Tag color="blue">Leading</Tag>
                    )}
                  </Space>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      title: "Last Work Entry",
      dataIndex: "most_recent_work_entry",
    },
    {
      title: "Most Recent Retainer",
      dataIndex: "most_recent_retainer_activated",
    },
  ];

  const dataSource: DataType[] = clients.map((client: ClientI) => ({
    id: client.id,
    company: client.company,
    team_members: client.team_members || [],
    most_recent_work_entry: client.most_recent_work_entry
      ? dayjs(client.most_recent_work_entry).format("YYYY-MM-DD")
      : "—",
    most_recent_retainer_activated: client.most_recent_retainer_activated
      ? dayjs(client.most_recent_retainer_activated).format("YYYY-MM-DD")
      : "—",
  }));

  return (
    <Table<DataType>
      className="custom-table"
      columns={columns}
      dataSource={dataSource}
      size="middle"
      rowKey="id"
    />
  );
};

export default ClientsAdminTable;