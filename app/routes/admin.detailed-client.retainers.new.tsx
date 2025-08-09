import { useOutletContext } from "@remix-run/react";
import { ClientI } from "~/interfaces/clients.interface";

type ContextType = { client: ClientI };

export default function ClientInvoicesPage() {
  const { client } = useOutletContext<ContextType>();

  return<p>retainers</p>;
}