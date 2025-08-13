// app/routes/api/contacts.ts
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";
import { buildCursorPaginationQuery } from "~/utils/pagination/buildCursorPaginationQuery";
import { buildPageInfo } from "~/utils/pagination/buildPageInfo";
import { ContactSchema } from "~/utils/schemas/contactSchema";

// GET /api/contacts → obtener todos los contactos
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor");
  const takeParam = url.searchParams.get("take");
  const direction = url.searchParams.get("direction") as "next" | "prev";
  const clientId = url.searchParams.get("client_id");

  const take = takeParam ? parseInt(takeParam, 10) : 6;

  const { queryOptions, isBackward } = buildCursorPaginationQuery({
    cursor,
    take,
    direction,
    orderByField: "createdAt",
    select: undefined, // usaremos include
  });

  // Si hay clientId, filtramos
  if (clientId) {
    queryOptions.where = { client_id: clientId };
  }

  queryOptions.include = {
    client: {
      select: {
        id: true,
        company: true,
      },
    },
  };

  const contacts = await prisma.contact.findMany(queryOptions);

  const { items, pageInfo } = buildPageInfo(contacts, take, isBackward, cursor);

  return new Response(
    JSON.stringify({ contacts: items, pageInfo }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};

// POST /api/contacts → crear nuevo contacto para un cliente
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const contactJson = formData.get("contact") as string;

  if (!contactJson) {
    return new Response(JSON.stringify({ error: "No contact data provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const parsed = JSON.parse(contactJson);
    const contact = ContactSchema.parse(parsed); // debe incluir client_id

    const savedContact = await prisma.contact.create({
      data: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        ...(contact.client_id && {
          client: { connect: { id: contact.client_id } },
        }),
      },
    });

    return new Response(JSON.stringify(savedContact), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating contact:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error && "errors" in error
            ? (error as any).errors
            : "Error creating contact",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};