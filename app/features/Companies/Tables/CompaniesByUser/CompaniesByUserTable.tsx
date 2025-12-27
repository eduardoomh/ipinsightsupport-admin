import { Table } from "antd";
import { FC, useContext } from "react";
import dayjs from "dayjs";
import { ClientI } from "~/interfaces/clients.interface";
import { useNavigate } from "@remix-run/react";
import { PageInfo } from "~/interfaces/pagination.interface";
import PaginationControls from "~/components/tables/PaginationControls";
import usePagination from "~/hooks/usePagination";
import { useTableLoading } from "~/hooks/useTableLoading";
import { UsersI } from "~/interfaces/users.interface";
import { ClientStatus } from '../../../../utils/general/getClientStatusLabel';
import { UserContext } from "~/context/UserContext";
import { getTimezoneLabel } from "~/utils/general/getTimezoneLabel";
import { companiesByUserColumns } from "./CompaniesByUserColumns";

export interface UserDataType {
  id: string;
  company: string;
  team_members: ClientI["team_members"];
  estimated_hours: {
    user_estimated_hours: any;
    user_rate_type: any;
  };
  account_manager: UsersI;
  timezone: string;
  currentStatus: ClientStatus;
  most_recent_work_entry: string;

}

interface Props {
  clients: ClientI[];
  pageInfo: PageInfo;
  onPageChange: (cursor: string, direction: "next" | "prev") => void;
  pageSize: number;
}

const ClientsUserTable: FC<Props> = ({ clients, pageInfo, onPageChange, pageSize }) => {
  const navigate = useNavigate();
  const user = useContext(UserContext)

  const { loading, handlePageChange } = useTableLoading(clients, onPageChange);
  const { currentPage, start, updatePage } = usePagination(pageSize, pageInfo, handlePageChange);
  const end = start + clients.length - 1;

  const columns = companiesByUserColumns(navigate);

  const dataSource: UserDataType[] = clients.map((client: ClientI) => {
    let userRateType: "engineering" | "architecture" | "senior_architecture" | null = null;
    let estimatedHoursForUser: number | null = null;

    // Revisar si el user actual está en team_members
    const teamMember = client.team_members?.find(tm => tm.user?.id === user?.id);

    if (teamMember) {
      userRateType = teamMember?.rate_type;

      // Calcular horas según el rate_type del user
      switch (userRateType) {
        case "engineering":
          estimatedHoursForUser = client.estimated_engineering_hours || 0.0;
          break;
        case "architecture":
          estimatedHoursForUser = client.estimated_architecture_hours || 0.0;
          break;
        case "senior_architecture":
          estimatedHoursForUser = client.estimated_senior_architecture_hours || 0.0;
          break;
      }
    }

    return {
      id: client.id,
      company: client.company,
      team_members: client.team_members || [],
      account_manager: client.account_manager,
      estimated_hours: {
        user_estimated_hours: estimatedHoursForUser,
        user_rate_type: userRateType
      },
      timezone: getTimezoneLabel(client.timezone as any),
      currentStatus: client.currentStatus as ClientStatus,
      most_recent_work_entry: client.most_recent_work_entry
        ? dayjs(client.most_recent_work_entry).format("YYYY-MM-DD")
        : "—",
    };
  });

  return (
    <>
      <Table<UserDataType>
        className="custom-table"
        columns={columns}
        dataSource={dataSource}
        size="middle"
        rowKey="id"
        pagination={false}
        loading={loading}
      />
      <PaginationControls
        currentPage={currentPage}
        pageInfo={pageInfo}
        start={start}
        end={end}
        onPageChange={updatePage}
      />
    </>
  );
};

export default ClientsUserTable;