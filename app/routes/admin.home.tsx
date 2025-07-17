import NoData from "~/components/basics/NoData";
import DashboardLayout from "~/components/layout/DashboardLayout";

export default function AdminHome() {

  return (
        <DashboardLayout
          title={`Admin`}
        >
          <NoData />
        </DashboardLayout>
  );
}