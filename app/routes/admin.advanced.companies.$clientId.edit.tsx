import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer, message } from "antd";
import { useEffect, useState } from "react";
import FormSkeleton from "~/components/basics/FormSkeleton";
import ClientForm from "~/components/views/clients/ClientsForm";
import type { ClientI } from "~/interfaces/clients.interface";

type OutletContext = {
  refreshResults: () => void;
};

export default function EditClientDrawer() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { refreshResults } = useOutletContext<OutletContext>();
  const [client, setClient] = useState<ClientI | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      const data = await res.json();
      setClient(data);
    } catch (err) {
      message.error("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const handleClose = () => navigate("/admin/advanced/companies");

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("client", JSON.stringify(values));

      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        message.success("Company updated successfully");
        refreshResults();
        handleClose();
      } else {
        message.error("Error updating company");
      }
    } catch (err) {
      message.error("Error updating company");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title="Edit Company"
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      {loading ? (
        <FormSkeleton />
      ) : (
        <ClientForm
          client={client}
          handleSubmit={handleSubmit}
          submitting={submitting}
          edit={true}
        />
      )}
    </Drawer>
  );
}