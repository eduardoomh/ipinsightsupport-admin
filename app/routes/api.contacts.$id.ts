import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { prisma } from "~/config/prisma.server";
import { ContactSchema } from "~/utils/schemas/contactSchema";

// GET /api/contacts/:id
export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Falta el ID del contacto" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      client: true,
    },
  });

  if (!contact) {
    return new Response(JSON.stringify({ error: "Contacto no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const defaultPassword = "changeme123";

  const isDefaultPassword = contact.password
    ? await bcrypt.compare(defaultPassword, contact.password)
    : false;

  const contactWithPasswordFlag = {
    ...contact,
    has_password: contact.password ? !isDefaultPassword : false, 
  };

  delete (contactWithPasswordFlag as any).password;

  return new Response(JSON.stringify(contactWithPasswordFlag), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// PUT & DELETE /api/contacts/:id
export const action: ActionFunction = async ({ params, request }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Falta el ID del contacto" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method;

  try {
    if (method === "DELETE") {
      const existing = await prisma.contact.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          client_id: true,
        },
      });

      if (!existing) {
        return new Response(JSON.stringify({ error: "Contacto no encontrado" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      await prisma.contact.delete({ where: { id } });

      return new Response(JSON.stringify({ deleted: existing }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "PUT") {
      const formData = await request.formData();
      const contactJson = formData.get("contact") as string;

      if (!contactJson) {
        return new Response(JSON.stringify({ error: "No se proporcionaron datos del contacto" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const parsed = ContactSchema.parse(JSON.parse(contactJson));

      const updated = await prisma.contact.update({
        where: { id },
        data: {
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone,
          // Solo agregamos client_id si está definido (puede ser null)
          ...(parsed.client_id !== undefined && { client_id: parsed.client_id }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          client_id: true,
          updatedAt: true,
        },
      });

      return new Response(JSON.stringify({ updated }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Método no soportado" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error manejando contacto:", error);
    return new Response(JSON.stringify({ error: "Error del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};