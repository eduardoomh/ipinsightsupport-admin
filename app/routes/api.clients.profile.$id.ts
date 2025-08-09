import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const clientId = params.id;

  if (!clientId) {
    return json({ error: "Missing client ID" }, { status: 400 });
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        company: true,
        timezone: true,
        remainingFunds: true,
        most_recent_work_entry: true,
        most_recent_retainer_activated: true,
        contacts: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        team_members: {
          select: {
            id: true,
            role: true,         // from TeamRole
            rate_type: true,    // from RateType
            user: {
              select: {
                id: true,
                name: true,
                type: true,      // redundant but included for clarity
              },
            },
          },
        },
        rates: {
          select: {
            engineeringRate: true,
            architectureRate: true,
            seniorArchitectureRate: true,
          },
        },
      },
    });

    if (!client) {
      return json({ error: "Client not found" }, { status: 404 });
    }

    // Account Manager - assume it's the user marked as technical_lead
    const accountManager = client.team_members.find(tm => tm.role === "technical_lead")?.user.name || "Unassigned";

    const rates = [
      { role: "Engineering", rate: `$${client.rates?.engineeringRate ?? 0}/hr` },
      { role: "Architecture", rate: `$${client.rates?.architectureRate ?? 0}/hr` },
      { role: "Senior Architecture", rate: `$${client.rates?.seniorArchitectureRate ?? 0}/hr` },
    ];

    const hoursRemaining = [
      { role: "Engineering", hours: "0.00 Hours" },
      { role: "Architecture", hours: "0.00 Hours" },
      { role: "Senior Architecture", hours: "0.00 Hours" },
    ]; // Placeholder unless you're ready to calculate from retainers/work_entries

    const team = client.team_members.map(tm => ({
      id: tm.user.id,
      name: tm.user.name,
      role: tm.rate_type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()), // format enum to title
      isLead: tm.role === "technical_lead",
    }));

    const result = {
      id: client.id,
      company: client.company,
      accountManager,
      region: `${client.timezone} Timezone`,
      mostRecentWorkEntry: client.most_recent_work_entry?.toISOString() ?? null,
      mostRecentRetainerActivated: client.most_recent_retainer_activated?.toISOString() ?? null,
      remainingFunds: `$${client.remainingFunds.toFixed(2)}`,
      rates,
      hoursRemaining,
      team,
      contacts: client.contacts,
    };

    return json(result, { status: 200 });
  } catch (error) {
    console.error("Error loading client profile:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};