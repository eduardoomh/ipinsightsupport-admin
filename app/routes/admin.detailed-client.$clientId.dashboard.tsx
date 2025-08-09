import { useOutletContext } from "@remix-run/react";
import DetailedClient from "~/components/views/clients/DetailedClient";
import { ClientI } from "~/interfaces/clients.interface";

type ContextType = { client: ClientI };

export default function ClientDefaultPage() {
  const { client } = useOutletContext<ContextType>();

  return <DetailedClient client={client} />;
}