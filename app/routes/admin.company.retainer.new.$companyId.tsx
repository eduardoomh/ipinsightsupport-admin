// routes/admin/advanced/retainers/$clientId.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useContext, useState } from "react";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ContentLayout from "~/components/layout/components/ContentLayout";
import { ClientI } from "~/interfaces/clients.interface";
import RetainerForm from "~/components/views/retainers/RetainersForm";
import { message } from "antd";
import { UserContext } from "~/context/UserContext";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const companyId = params.companyId;
  if (!companyId) {
    throw new Response("Company ID is required", { status: 400 });
  }

  const res = await fetch(`${process.env.APP_URL}/api/clients/${companyId}`);
  if (!res.ok) {
    throw new Response("Company not found", { status: 404 });
  }

  const client: ClientI = await res.json();

  return { client };
};

export default function NewRetainersPage() {
  const { client } = useLoaderData<typeof loader>();
  const user = useContext(UserContext)
  const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: any) => {
    setSubmitting(true);

    try {
      // 1. Crear el cliente
      const retainerFormData = new FormData();
      const retainerPayload = {
        amount: values.amount,
        date_activated: values.date_activated,
        note: values.note,
        is_credit: values.is_credit,
        created_by_id: user.id,
        client_id: client.id
      };
      retainerFormData.append("retainer", JSON.stringify(retainerPayload));

      const clientRes = await fetch("/api/retainers", {
        method: "POST",
        body: retainerFormData,
      });

      if (!clientRes.ok) {
        throw new Error("Failed to create retainer");
      }

      await clientRes.json();

      message.success("Retainer created successfully");
    } catch (err: any) {
      console.error(err);
      message.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title={client.company} type="client_section" id={client.id}>
      <ContentLayout title={`New retainer`} type="basic_section" size="small" hideHeader={false}>
        <RetainerForm 
          handleSubmit={handleSubmit} 
          submitting={submitting}
        />
      </ContentLayout>
    </DashboardLayout>
  );
}