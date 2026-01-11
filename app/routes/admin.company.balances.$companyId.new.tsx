import { useOutletContext, useNavigate } from "@remix-run/react";
import { Drawer } from "antd";
import BalanceForm from "~/features/Balances/Forms/BalanceForm";
import { useCreateBalance } from "~/features/Balances/Hooks/useCreateBalance";

type OutletContext = { 
  refreshResults: () => void; 
  company: { id: string, company: string } 
};

export default function NewBalanceDrawerRoute() {
  const navigate = useNavigate();
  const { refreshResults, company } = useOutletContext<OutletContext>();

  const handleClose = () => navigate(`/admin/company/balances/${company.id}`);

  // Usamos el nuevo hook
  const { createBalance, submitting } = useCreateBalance(company.id, () => {
    refreshResults();
    handleClose();
  });

  return (
    <Drawer
      title={`Create New Balance for ${company.company}`}
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      <BalanceForm
        handleSubmit={createBalance}
        submitting={submitting}
      />
    </Drawer>
  );
}