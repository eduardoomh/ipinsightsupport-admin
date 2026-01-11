// routes/admin/company/work-entries/edit.$entryId.tsx (o tu ruta actual)
import { useNavigate, useOutletContext, useParams } from "@remix-run/react";
import { Drawer } from "antd";
import FormSkeleton from "~/components/basics/FormSkeleton";
import WorkEntryForm from "~/features/WorkEntries/Forms/WorkEntriesForm";
import { useEditWorkEntry } from "~/features/WorkEntries/Hook/useEditWorkEntry";

type OutletContext = {
    refreshResults: () => void;
};

export default function EditWorkEntryDrawer() {
    const { entryId, companyId } = useParams();
    const navigate = useNavigate();
    const { refreshResults } = useOutletContext<OutletContext>();

    const handleClose = () => navigate(`/admin/company/work-entries/${companyId}`);

    // Usamos el hook de edición
    const { entry, loading, submitting, updateWorkEntry } = useEditWorkEntry(
        entryId,
        () => {
            refreshResults();
            handleClose();
        }
    );

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
                    handleSubmit={updateWorkEntry}
                    submitting={submitting}
                    users={[]}
                    workEntry={entry}
                />
            )}
        </Drawer>
    );
}