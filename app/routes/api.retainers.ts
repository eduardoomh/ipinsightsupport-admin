// app/routes/api/retainers.ts
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { RetainerSchema } from "~/utils/schemas/retainerSchema";

// GET /api/retainers → obtener todos los retainers
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id"); // <-- nuevo
  const cursor = url.searchParams.get("cursor");
  const takeParam = url.searchParams.get("take");
  const direction = url.searchParams.get("direction") as "next" | "prev";

  const take = takeParam ? parseInt(takeParam, 10) : 6;

  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "date_activated",
    select: undefined,
  });

  // Si viene client_id, agrega filtro
  if (clientId) {
    queryOptions.where = {
      ...(queryOptions.where || {}),
      client_id: clientId,
    };
  }

  queryOptions.include = {
    client: true,
    created_by: true,
  };

  const retainers = await prisma.retainer.findMany(queryOptions);

  const { items, pageInfo } = buildPageInfo(retainers, take, isBackward, cursor);

  return new Response(
    JSON.stringify({ retainers: items, pageInfo }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

// POST /api/retainers → crear un nuevo retainer
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const retainerJson = formData.get("retainer") as string;

  if (!retainerJson) {
    return new Response(JSON.stringify({ error: "No retainer data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = RetainerSchema.parse(JSON.parse(retainerJson));

    const newRetainer = await prisma.retainer.create({
      data: {
        amount: parsed.amount,
        date_activated: new Date(parsed.date_activated),
        note: parsed.note,
        is_credit: parsed.is_credit,
        client: { connect: { id: parsed.client_id } },
        created_by: { connect: { id: parsed.created_by_id } },
      },
    });

    return new Response(JSON.stringify(newRetainer), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating retainer:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error && "errors" in error
            ? (error as any).errors
            : "Error creating retainer",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};