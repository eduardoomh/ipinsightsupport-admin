import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer, message } from "antd";
import { useEffect, useState } from "react";
import FormSkeleton from "~/components/basics/FormSkeleton";
import WorkEntryForm from "~/components/views/entries/WorkEntriesForm";
import { WorkEntry } from "~/interfaces/workEntries.interface";

type OutletContext = {
    refreshResults: () => void;
};

export default function EditWorkEntryDrawer() {
    const { entryId, companyId } = useParams();
    const navigate = useNavigate();
    const { refreshResults } = useOutletContext<OutletContext>();
    const [entry, setEntry] = useState<WorkEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const fetchEntry = async () => {
        try {
            const res = await fetch(`/api/work-entries/${entryId}`);
            const data = await res.json();
            setEntry(data);
        } catch (err) {
            message.error("Failed to load company data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntry();
    }, [entryId]);

    const handleClose = () => navigate(`/admin/company/work-entries/${companyId}`);

    const handleSubmit = async (values: any) => {
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("entry", JSON.stringify({...values, user_id: entry.user.id, client_id: entry.client.id}));

            const res = await fetch(`/api/work-entries/${entryId}`, {
                method: "PUT",
                body: formData,
            });

            if (res.ok) {
                message.success("Work entry updated successfully");
                refreshResults();
                handleClose();
            } else {
                message.error("Error updating Work entry");
            }
        } catch (err) {
            message.error("Error updating Work entry");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Drawer
            title="Edit Work entry"
            open={true}
            onClose={handleClose}
            width={720}
            destroyOnClose
            placement="right"
        >
            {loading ? (
                <FormSkeleton />
            ) : (
                <WorkEntryForm
                    handleSubmit={handleSubmit}
                    submitting={submitting}
                    users={[]}
                    workEntry={entry}
                />
            )}
        </Drawer>
    );
}