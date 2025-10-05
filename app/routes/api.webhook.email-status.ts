import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.json();
    console.log("Webhook recibido:", body);

    return json(
      { message: "Webhook recibido correctamente", data: body },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error procesando webhook:", error);
    return json({ error: "Body inválido o error interno" }, { status: 400 });
  }
};

export const loader = async () => {
  return json({ message: "Método no permitido" }, { status: 405 });
};