import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer, message } from "antd";
import { useEffect, useState } from "react";
import ClientForm from "~/components/views/clients/ClientsForm";
import type { ClientI } from "~/interfaces/clients.interface";

type OutletContext = {
  refreshClients: () => void;
};

export default function EditClientDrawer() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { refreshClients } = useOutletContext<OutletContext>();
  const [client, setClient] = useState<ClientI | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchClient = async () => {
    try {
      const res = await fetch(`/api/clients/${clientId}`);
      const data = await res.json();
      setClient(data);
    } catch (err) {
      message.error("Failed to load client data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const handleClose = () => navigate("/admin/advanced/clients");

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
        message.success("Client updated successfully");
        refreshClients();
        handleClose();
      } else {
        message.error("Error updating client");
      }
    } catch (err) {
      message.error("Error updating client");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title="Edit Client"
      open={true}
      onClose={handleClose}
      width={720}
      destroyOnClose
      placement="right"
    >
      {loading ? (
        <div className="text-center py-8">Loading client data...</div>
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