// routes/admin/advanced/users/new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { message, Drawer } from "antd";
import { useContext, useState } from "react";
import RetainerForm from "~/components/views/retainers/RetainersForm";
import { UserContext } from "~/context/UserContext";

export default function NewUserDrawerRoute() {
    const navigate = useNavigate();
    const { refreshResults, client } = useOutletContext<{ refreshResults: () => void, client: any }>();
    //const { client } = useLoaderData<typeof loader>();
    const [submitting, setSubmitting] = useState(false);
    const user = useContext(UserContext)

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
                created_by_id: user.id,
                client_id: client.id
            };

            if (values.note) {
                retainerPayload.note = values.note;
            }

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