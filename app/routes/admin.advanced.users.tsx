// routes/admin/advanced/users/index.tsx
import { defer, LoaderFunction } from "@remix-run/node";
import {
  Await,
  useLoaderData,
  redirect,
  Outlet,
  useNavigate,
} from "@remix-run/react";
import { Suspense, useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import DashboardLayout from "~/components/layout/DashboardLayout";
import SkeletonEntries from "~/components/skeletons/SkeletonEntries";
import UsersTable from "~/components/views/users/UsersTable";
import { UsersI } from "~/interfaces/users.interface";
import { delay } from "~/utils/general/delay";
import { getSessionFromCookie } from "~/utils/sessions/getSessionFromCookie";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSessionFromCookie(request);
  if (!session) return redirect("/login");

  const fetchUsers = async () => {
    const res = await fetch(`${process.env.APP_URL}/api/users`);
    const data = await res.json();
    return delay(500, data);
  };

  return defer({
    users: fetchUsers(),
  });
};

export default function UsersPage() {
  const { users } = useLoaderData<typeof loader>();
  const [localUsers, setLocalUsers] = useState<UsersI[] | null>(null);
  const navigate = useNavigate();

  const refreshUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setLocalUsers(data);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLocalUsers((prev) => prev?.filter((entry) => entry.id !== id) ?? []);
      } else {
        console.error("Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const headerActions = (
    <Button
      type="primary"
      className="bg-primary"
      icon={<PlusOutlined />}
      onClick={() => navigate("/admin/advanced/users/new")} // 👉 esto activa el modal
    >
      Create User
    </Button>
  );

  return (
    <DashboardLayout title="Manage users" headerActions={headerActions}>
      <Suspense fallback={<SkeletonEntries />}>
        <Await resolve={users}>
          {(resolvedUsers: UsersI[]) => {
            const currentUsers = localUsers ?? resolvedUsers;

            if (!localUsers) setLocalUsers(resolvedUsers);

            return (
              <>
                <UsersTable users={currentUsers} onDelete={handleDelete} />
                <Outlet context={{ refreshUsers }} /> {/* 👈 importante para que el modal sepa cómo refrescar */}
              </>
            );
          }}
        </Await>
      </Suspense>
    </DashboardLayout>
  );
}