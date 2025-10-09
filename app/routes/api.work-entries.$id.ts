import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { prisma } from "~/config/prisma.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing work entry id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const workEntry = await prisma.workEntry.findUnique({
      where: { id },
      include: {
        client: {
          select: { id: true, company: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!workEntry) {
      return new Response(JSON.stringify({ error: "Work entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(workEntry), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error fetching work entry:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing work entry id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const formData = await request.formData();
    const entryData = formData.get("entry")?.toString();

    if (!entryData) {
      return new Response(JSON.stringify({ error: "No entry data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const {
      user_id,
      client_id,
      billed_on,
      hours_billed,
      hours_spent,
      summary,
    } = JSON.parse(entryData);

    // 1️⃣ Obtener entry actual y client
    const currentEntry = await prisma.workEntry.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!currentEntry) {
      return new Response(JSON.stringify({ error: "Work entry not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = currentEntry.client;
    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2️⃣ Calcular diferencia de horas y ajustar remainingFunds
    const hourDiff = hours_billed - currentEntry.hours_billed; // positivo si aumentan horas, negativo si disminuyen
    const fundAdjustment = hourDiff * currentEntry.hourly_rate;
    let newRemainingFunds = Number(client.remainingFunds) - fundAdjustment;

    if (client?.billing_type === "MONTHLY_PLAN") {
      newRemainingFunds = Number(client.remainingFunds);
    }
    
    // Determinar mes/año del work entry
    const billedDate = billed_on ? new Date(billed_on) : currentEntry.billed_on;
    const month = billedDate ? billedDate.getMonth() + 1 : new Date().getMonth() + 1;
    const year = billedDate ? billedDate.getFullYear() : new Date().getFullYear();

    // 3️⃣ Transacción para actualizar entry, cliente, userStats y adminStats
    const [updatedWorkEntry, updatedClient] = await prisma.$transaction(async (tx) => {
      // Actualizar work entry
      const updatedWorkEntry = await tx.workEntry.update({
        where: { id },
        data: {
          user_id,
          client_id,
          billed_on: billed_on ? new Date(billed_on) : null,
          hours_billed,
          hours_spent,
          billing_type: client?.billing_type || "HOURLY",
          summary,
        },
        include: {
          client: { select: { id: true, company: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      // Actualizar cliente
      const updatedClient = await tx.client.update({
        where: { id: client_id },
        data: {
          remainingFunds: newRemainingFunds,
        },
      });

      // 📊 Ajustar UserStats
      if (hourDiff !== 0) {
        let rateField: "hours_engineering" | "hours_architecture" | "hours_senior_architecture";

        switch (currentEntry.rate_type) {
          case "engineering":
            rateField = "hours_engineering";
            break;
          case "architecture":
            rateField = "hours_architecture";
            break;
          case "senior_architecture":
            rateField = "hours_senior_architecture";
            break;
          default:
            rateField = "hours_engineering";
        }

        const userStats = await tx.userStats.findFirst({
          where: { user_id: currentEntry.user_id, month, year },
        });

        if (userStats) {
          await tx.userStats.update({
            where: { id: userStats.id },
            data: {
              [rateField]: (userStats[rateField] ?? 0) + hourDiff,
            },
          });
        } else {
          // Solo creamos si hay horas positivas
          if (hourDiff > 0) {
            await tx.userStats.create({
              data: {
                user_id: currentEntry.user_id,
                month,
                year,
                total_work_entries: 0,
                companies_as_account_manager: 0,
                companies_as_team_member: 0,
                hours_engineering: rateField === "hours_engineering" ? hourDiff : 0,
                hours_architecture: rateField === "hours_architecture" ? hourDiff : 0,
                hours_senior_architecture:
                  rateField === "hours_senior_architecture" ? hourDiff : 0,
              },
            });
          }
        }

        // 📊 Ajustar AdminStats
        const adminStats = await tx.adminStats.findFirst({
          where: { month, year },
        });

        if (adminStats) {
          await tx.adminStats.update({
            where: { id: adminStats.id },
            data: {
              [rateField]: (adminStats[rateField] ?? 0) + hourDiff,
              hours_total: (adminStats.hours_total ?? 0) + hourDiff,
            },
          });
        } else {
          // Igual que con UserStats, solo crear si es positivo
          if (hourDiff > 0) {
            await tx.adminStats.create({
              data: {
                month,
                year,
                total_work_entries: 0,
                total_retainers: 0,
                total_clients: 0,
                retainers_amount: 0.0,
                hours_total: hourDiff,
                hours_engineering: rateField === "hours_engineering" ? hourDiff : 0,
                hours_architecture: rateField === "hours_architecture" ? hourDiff : 0,
                hours_senior_architecture:
                  rateField === "hours_senior_architecture" ? hourDiff : 0,
              },
            });
          }
        }
      }

      return [updatedWorkEntry, updatedClient];
    });

    return new Response(
      JSON.stringify({ workEntry: updatedWorkEntry, client: updatedClient }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error updating work entry:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};