// routes/admin/advanced/users/new.tsx
import { useOutletContext, useNavigate } from "@remix-run/react";
import { message, Drawer } from "antd";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "~/context/UserContext";
import WorkEntryForm from "~/features/WorkEntries/Forms/WorkEntriesForm";

export default function NewUserDrawerRoute() {
    const navigate = useNavigate();
    const { refreshResults, client } = useOutletContext<{ refreshResults: () => void, client: any }>();
    //const { client } = useLoaderData<typeof loader>();
    const [submitting, setSubmitting] = useState(false);
    const [users, setUsers] = useState([]);
    const user = useContext(UserContext)

      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const res = await fetch("/api/users?take=100&fields=id,name");
            const data = await res.json();
            setUsers(data.users);
          } catch (error) {
            console.error("Failed to load companies");
          }
        };
    
        fetchUsers();
      }, []);
    

    const handleClose = () => navigate(`/company/work-entries/${client.id}`);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);

        try {
            const workEntryFormData = new FormData();

            const workEntryPayload: any = {
                ...values,
                client_id: client.id
            };

            workEntryFormData.append("workEntry", JSON.stringify(workEntryPayload));

            const clientRes = await fetch("/api/work-entries", {
                method: "POST",
                body: workEntryFormData,
            });

            if (!clientRes.ok) {
                throw new Error("Failed to create Work entry");
            }

            await clientRes.json();

            message.success("Work entry created successfully");
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
            title="Create New Work entry"
            open={true}
            onClose={handleClose}
            footer={null}
            width={720}
            destroyOnClose
            placement="right"
        >
            <WorkEntryForm
                handleSubmit={handleSubmit}
                submitting={submitting}
                users={users}
                user={user as any}
                company={client}
            />
        </Drawer>
    );
}