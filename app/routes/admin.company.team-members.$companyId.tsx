import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { message } from "antd";
import { useState } from "react";
import ContentLayout from "~/components/layout/components/ContentLayout";
import DashboardLayout from "~/components/layout/DashboardLayout";
import ClientRatesForm from "~/components/views/clientRates/ClientRatesForm";
import TeamMemberForm from "~/components/views/teamMembers/TeamMemberForm";
import { ClientI } from "~/interfaces/clients.interface";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import TeamMember from '../components/views/detailedClients/utils/TeamMember';

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

    let teamMembers: any[] = [];
    let edit = false;

    if (teamRes.ok) {
        const teamData = await teamRes.json();
        if (Array.isArray(teamData) && teamData.length > 0) {
            teamMembers = teamData;
            edit = true;
        }
    }

    // Obtener users con paginación (take=100)
    const usersRes = await fetch(`${process.env.APP_URL}/api/users?take=100`);
    let users: any[] = [];

    if (usersRes.ok) {
        const usersData = await usersRes.json();
        if (usersData && Array.isArray(usersData.users)) {
            users = usersData.users;
        }
    }

    return { client, teamMembers, edit, users };
};

export default function NewUserDrawerRoute() {
    const { client, teamMembers, users, edit } = useLoaderData<{ client: ClientI, teamMembers: any, edit: boolean, users: any }>();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (newTeamMembers: any[]) => {
        setSubmitting(true);

        try {
            // Map de miembros actuales para acceso rápido por user_id
            // IMPORTANTE: teamMembers que tienes afuera debe tener al menos { id, user_id }
            const existingMap = new Map(teamMembers.map(m => [m.user_id, m]));

            // 1) Crear promesas para crear o actualizar según existan o no
            const upsertPromises = newTeamMembers.map(async (member) => {
                const existing = existingMap.get(member.user_id);
                const formData = new FormData();
                formData.append("teamMember", JSON.stringify({
                    client_id: member.client_id,
                    user_id: member.user_id,
                    role: member.role,
                    rate_type: member.rate_type,
                }));

                if (existing) {
                    // Actualizar con PUT usando el id de DB
                    //@ts-ignore
                    const res = await fetch(`/api/team-members/${existing.id}`, {
                        method: "PUT",
                        body: formData,
                    });
                    if (!res.ok) throw new Error(`Failed to update team member ${member.user_id}`);
                } else {
                    // Crear nuevo con POST
                    const res = await fetch(`/api/team-members`, {
                        method: "POST",
                        body: formData,
                    });
                    if (!res.ok) throw new Error(`Failed to create team member ${member.user_id}`);
                }
            });

            // 2) Borrar los miembros que existen en teamMembers pero no están en newTeamMembers
            const newUserIds = new Set(newTeamMembers.map(m => m.user_id));
            const toDelete = teamMembers.filter(m => !newUserIds.has(m.user_id));

            const deletePromises = toDelete.map(async (member) => {
                const res = await fetch(`/api/team-members/${member.id}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error(`Failed to delete team member ${member.user_id}`);
            });

            // 3) Esperar que todas las operaciones terminen
            await Promise.all([...upsertPromises, ...deletePromises]);

            message.success(edit ? "Team members updated successfully" : "Team members created successfully");
            // Si necesitas refrescar o navegar, hazlo aquí

        } catch (error: any) {
            console.error(error);
            message.error(error.message || "Something went wrong");
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
                <TeamMemberForm
                    teamMembers={teamMembers}
                    users={users}
                    handleSubmit={handleSubmit}
                    submitting={submitting}
                    edit={edit}
                    clientId={client.id}
                />
            </ContentLayout>
        </DashboardLayout>
    );
}