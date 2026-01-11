import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { withTwoResourcesDefer } from "~/utils/pagination/withPaginationDefer";
import { useCursorPagination } from "~/hooks/useCursorPagination";
import { useRefreshAndResetPagination } from "~/hooks/useRefreshAndResetPagination";
import { useDeleteResource } from "~/hooks/useDeleteResource";

import { CompanyTableView } from "~/components/TableActions/CompanyTableView";
import ContactsTable from "~/features/Contacts/Tables/ContactsTable";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";

export const loader: LoaderFunction = async ({ request, params }) => {
  const companyId = params.companyId;
  if (!companyId) {
    throw new Response("companyId is required", { status: 400 });
  }

  return withTwoResourcesDefer({
    request,
    sessionCheck: () => getSessionFromCookie(request),
    resources: [
      { 
        key: "client", 
        apiPath: `${process.env.APP_URL}/api/clients/${companyId}?fields=id,company,currentStatus` 
      },
      { 
        key: "contactsByClientData", 
        apiPath: `${process.env.APP_URL}/api/contacts?client_id=${companyId}` 
      },
    ],
  });
};

export const meta: MetaFunction = () => [
  { title: "Company Contacts | Sentinelux" },
  { name: "description", content: "Contacts page from Sentinelux Admin" },
];

export default function ClientContactsPage() {
  const { client, contactsByClientData } = useLoaderData<typeof loader>();
  const { take, handlePageChange } = useCursorPagination("contactsByClientData");
  const navigate = useNavigate();

  const refreshResults = useRefreshAndResetPagination(`/admin/company/contacts/${client.id}`);
  const deleteContact = useDeleteResource("/api/contacts", refreshResults);

  const createButtonConfig = {
    label: "Create Contact",
    path: `/admin/company/contacts/${client.id}/new`
  };

  const headerActions = (
    <>
      <Button
        type="primary"
        className="bg-primary"
        icon={<PlusOutlined />}
        onClick={() => navigate(createButtonConfig.path)}
      >
        {createButtonConfig.label}
      </Button>
    </>
  );

  return (
    <CompanyTableView
      title="Contacts"
      company={client}
      resolve={contactsByClientData}
      skeleton={<SkeletonEntries />}
      refreshResults={refreshResults}
      headerActions={headerActions}
    >
      {(data) => (
        <ContactsTable
          contacts={data.contacts}
          pageInfo={data.pageInfo}
          onDelete={deleteContact}
          onPageChange={handlePageChange}
          pageSize={take}
          viewAction={false}
          editActionPath={`/admin/company/contacts/${client.id}/edit`}
        />
      )}
    </CompanyTableView>
  );
}