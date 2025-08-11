import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { message } from "antd";
import { useState } from "react";
import ContentLayout from "~/components/layout/components/ContentLayout";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ClientRatesForm from "~/components/views/clientRates/ClientRatesForm";
import { ClientI } from "~/interfaces/clients.interface";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const companyId = params.companyId;
  if (!companyId) {
    throw new Response("Company ID is required", { status: 400 });
  }

  // Obtener datos del cliente
  const clientRes = await fetch(`${process.env.APP_URL}/api/clients/${companyId}`);
  if (!clientRes.ok) {
    throw new Response("Company not found", { status: 404 });
  }
  const client: ClientI = await clientRes.json();

  // Buscar teamMembers para ese cliente
  const teamRes = await fetch(`${process.env.APP_URL}/api/team-members?client_id=${companyId}`);

  let teamMembers: any[] = []; // 🔹 siempre array
  let edit = false;

  if (teamRes.ok) {
    const teamData = await teamRes.json();
    if (Array.isArray(teamData) && teamData.length > 0) {
      teamMembers = teamData;
      edit = true;
    }
  }

  return { client, teamMembers, edit };
};

export default function NewUserDrawerRoute() {
    const { client, clientRates, edit } = useLoaderData<{ client: ClientI, clientRates: any, edit: boolean }>();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);

        try {
            const clientRatesFormData = new FormData();

            const ratesPayload = {
                engineeringRate: values.engineeringRate.toString(),
                architectureRate: values.architectureRate.toString(),
                seniorArchitectureRate: values.seniorArchitectureRate.toString(),
                clientId: client.id,
            };

            clientRatesFormData.append("clientRates", JSON.stringify(ratesPayload));

            const method = edit ? "PUT" : "POST";

            const response = await fetch("/api/client-rates", {
                method,
                body: clientRatesFormData,
            });

            if (!response.ok) {
                throw new Error("Failed to save client rates");
            }

            await response.json();

            message.success(edit ? "Client rates updated successfully" : "Client rates created successfully");
            // Aquí maneja refreshResults o navegación si es necesario
        } catch (err: any) {
            console.error(err);
            message.error(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout title={client.company} type="client_section" id={client.id}>
            <ContentLayout
                title={edit ? "Current Team" : "New Team"}
                type="basic_section"
                size="small"
                hideHeader={false}>
                <p>TEAM MEMBERS</p>
            </ContentLayout>
        </DashboardLayout>
    );
}