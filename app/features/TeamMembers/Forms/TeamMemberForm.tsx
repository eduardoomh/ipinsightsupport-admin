import { useState, useEffect } from "react";
import { Table, Checkbox, Select, Button } from "antd";

const { Option } = Select;

interface User {
  id: string;
  name: string;
}

interface TeamMember {
  user_id: string;
  role: "on_team" | "technical_lead";
  rate_type: "architecture" | "engineering" | "senior_architecture";
}

interface Props {
  clientId: string;
  users: User[];
  teamMembers: TeamMember[];
  handleSubmit: (data: TeamMember[]) => void;
  submitting: boolean;
  edit: boolean;
}

interface UserRow {
  key: string;
  user: User;
  role: "on_team" | "technical_lead" | null;
  rate_type: "architecture" | "engineering" | "senior_architecture" | null;
}

export default function TeamMemberForm({
  clientId,
  users,
  teamMembers,
  handleSubmit,
  submitting,
  edit,
}: Props) {
  const [dataSource, setDataSource] = useState<UserRow[]>([]);

  useEffect(() => {
    const rows = users.map((user) => {
      const member = teamMembers.find((tm) => tm.user_id === user.id);
      return {
        key: user.id,
        user,
        role: member?.role ?? null,
        rate_type: member?.rate_type ?? null,
      };
    });
    setDataSource(rows);
  }, [users, teamMembers]);

  // Al cambiar el checkbox "on_team"
  const onOnTeamChange = (id: string, checked: boolean) => {
    setDataSource((prev) =>
      prev.map((row) => {
        if (row.key !== id) return row;

        // Si se desmarca, limpia role y rate_type
        if (!checked) {
          return { ...row, role: null, rate_type: null };
        }

        // Si se marca on_team y antes no estaba, poner role 'on_team' por defecto si no era líder
        return { ...row, role: row.role === "technical_lead" ? "technical_lead" : "on_team" };
      })
    );
  };

  // Al cambiar el checkbox "technical_lead"
  const onTechnicalLeadChange = (id: string, checked: boolean) => {
    setDataSource((prev) =>
      prev.map((row) => {
        if (row.key !== id) return row;

        if (checked) {
          // Si marca líder técnico, se asume on_team y role = technical_lead
          return { ...row, role: "technical_lead", rate_type: row.rate_type ?? null };
        } else {
          // Si desmarca líder técnico, deja on_team activo y role = on_team
          return { ...row, role: row.role === "technical_lead" ? "on_team" : row.role };
        }
      })
    );
  };

  // Cambiar rate_type
  const onRateTypeChange = (userId: string, value: "architecture" | "engineering" | "senior_architecture") => {
    setDataSource((prev) =>
      prev.map((row) => (row.key === userId ? { ...row, rate_type: value } : row))
    );
  };

  // Para el checkbox on_team: checked si role es 'on_team' o 'technical_lead'
  const isOnTeam = (row: UserRow) => row.role === "on_team" || row.role === "technical_lead";

  // Para el checkbox technical_lead: checked si role es 'technical_lead'
  const isTechnicalLead = (row: UserRow) => row.role === "technical_lead";

  const columns = [
    {
      title: "User Name",
      dataIndex: ["user", "name"],
      key: "name",
    },
    {
      title: "On Team",
      dataIndex: "onTeam",
      key: "onTeam",
      render: (_: any, record: UserRow) => (
        <Checkbox
          checked={isOnTeam(record)}
          onChange={(e) => onOnTeamChange(record.key, e.target.checked)}
          disabled={isTechnicalLead(record)} // no puede desmarcar si es líder técnico
        />
      ),
    },
    {
      title: "Technical Lead",
      dataIndex: "technicalLead",
      key: "technicalLead",
      render: (_: any, record: UserRow) => (
        <Checkbox
          checked={isTechnicalLead(record)}
          onChange={(e) => onTechnicalLeadChange(record.key, e.target.checked)}
          disabled={!isOnTeam(record)} // solo habilitado si está en equipo
        />
      ),
    },
    {
      title: "Role Type",
      dataIndex: "rate_type",
      key: "rate_type",
      render: (_: any, record: UserRow) => (
        <Select
          value={record.rate_type ?? undefined}
          onChange={(value) => onRateTypeChange(record.key, value)}
          disabled={!isOnTeam(record)}
          placeholder="Select role type"
          style={{ width: 160 }}
        >
          <Option value="architecture">Architecture</Option>
          <Option value="engineering">Engineering</Option>
          <Option value="senior_architecture">Senior Architecture</Option>
        </Select>
      ),
    },
  ];

  const onSubmit = () => {
    // Solo envía los usuarios que están en equipo (on_team o technical_lead) y que tienen rate_type definido
    const payload: TeamMember[] = dataSource
      .filter((row) => isOnTeam(row) && row.rate_type)
      .map((row) => ({
        client_id: clientId,
        user_id: row.key,
        role: row.role!,
        rate_type: row.rate_type!,
      }));

    handleSubmit(payload);
  };

  return (
    <>
      <Table className="custom-table" rowKey="key" columns={columns} dataSource={dataSource} pagination={false} />
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        className="bg-primary"
        loading={submitting}
        block
        style={{ marginTop: 16 }}
        onClick={onSubmit}
      >
        {edit ? "Update Members" : "Add Members"}
      </Button>
    </>
  );
}