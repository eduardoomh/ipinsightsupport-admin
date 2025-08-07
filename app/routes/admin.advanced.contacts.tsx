import { PlusOutlined } from "@ant-design/icons";
import { defer, LoaderFunction } from "@remix-run/node";
import { Await, useLoaderData, redirect, Outlet, useNavigate } from "@remix-run/react";
import { Button } from "antd";
import { Suspense, useState } from "react";
import ContactsTable from "~/components/views/contacts/ContactsTable";
import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import { delay } from "~/utils/general/delay";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";
import { ContactI } from "~/interfaces/contact.interface";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const fetchContacts = async () => {
    const res = await fetch(`${process.env.APP_URL}/api/contacts`);
    const data = await res.json();
    return delay(500, data);
  };

  return defer({
    contacts: fetchContacts(),
  });
};

export default function ContactsPage() {
  const { contacts } = useLoaderData<typeof loader>();
  const [localContacts, setLocalContacts] = useState<ContactI[] | null>(null);
  const navigate = useNavigate();

  const refreshContacts = async () => {
    const res = await fetch("/api/contacts");
    const data = await res.json();
    setLocalContacts(data);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLocalContacts((prev) => prev?.filter((entry) => entry.id !== id) ?? []);
      } else {
        console.error("Failed to delete contact");
      }
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  const headerActions = (
    <Button
      type="primary"
      className="bg-primary"
      icon={<PlusOutlined />}
      onClick={() => navigate("/admin/advanced/contacts/new")}
    >
      Create Contact
    </Button>
  );

  return (
    <DashboardLayout title="Manage contacts" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={contacts}>
          {(resolvedContacts: ContactI[]) => {
            const currentContacts = localContacts ?? resolvedContacts;

            // Inicializa `localEntries` solo una vez
            if (!localContacts) setLocalContacts(resolvedContacts);

            return (
              <>
                <ContactsTable contacts={currentContacts} onDelete={handleDelete} />
                <Outlet context={{ refreshContacts }} /> {/* 👈 importante para que el modal sepa cómo refrescar */}
              </>
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}