import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stats = await prisma.userStats.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  if (!stats) {
    return new Response(JSON.stringify({ error: "Stats not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};


export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (request.method === "PUT") {
    try {
      const body = await request.json();
      const updated = await prisma.userStats.update({
        where: { id },
        data: {
          total_work_entries: body.total_work_entries,
          companies_as_account_manager: body.companies_as_account_manager,
          companies_as_team_member: body.companies_as_team_member,
          hours_engineering: body.hours_engineering,
          hours_architecture: body.hours_architecture,
          hours_senior_architecture: body.hours_senior_architecture,
          month: body.month,
          year: body.year,
        },
      });

      return new Response(JSON.stringify(updated), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: "Stats not found or could not update" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  if (request.method === "DELETE") {
    try {
      await prisma.userStats.delete({ where: { id } });
      return new Response(JSON.stringify({ message: "Stats deleted successfully" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({ error: "Stats not found or could not delete" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};