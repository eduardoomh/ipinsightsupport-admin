// routes/admin/advanced/users/new.tsx
import { LoaderFunction, redirect } from "@remix-run/node";
import { useOutletContext, useNavigate, useLoaderData } from "@remix-run/react";
import { message, Drawer } from "antd";
import { useContext, useState } from "react";
import RetainerForm from "~/components/views/retainers/RetainersForm";
import { UserContext } from "~/context/UserContext";
import { ClientI } from "~/interfaces/clients.interface";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

/*
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
*/

export default function NewUserDrawerRoute() {
    const navigate = useNavigate();
    const { refreshResults, client } = useOutletContext<{ refreshResults: () => void, client: any }>();
    //const { client } = useLoaderData<typeof loader>();
    const [submitting, setSubmitting] = useState(false);
    const user = useContext(UserContext)

    console.log(user, "esto deberia devolver user")

    const handleClose = () => navigate(`/admin/company/retainers/${client.id}`);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);

        try {
            const retainerFormData = new FormData();

            const retainerPayload: any = {
                amount: Number(values.amount), // asegurar que sea numérico
                date_activated: values.date_activated,
                is_credit: values.is_credit,
                //@ts-ignore
                created_by_id: user.userId,
                client_id: client.id
            };

            if (values.note) {
                retainerPayload.note = values.note;
            }

            console.log(retainerPayload);
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
            refreshResults();
        } catch (err: any) {
            console.error(err);
            message.error(err.message || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Drawer
            title="Create New Retainer"
            open={true}
            onClose={handleClose}
            footer={null}
            width={720}
            destroyOnClose
            placement="right"
        >
            <RetainerForm
                handleSubmit={handleSubmit}
                submitting={submitting}
            />
        </Drawer>
    );
}