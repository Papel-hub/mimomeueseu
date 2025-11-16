import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.EVENTBRITE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID; // opcional, caso queira listar eventos de uma organização

  if (!token) {
    return NextResponse.json(
      { error: "Token do Eventbrite não definido" },
      { status: 500 }
    );
  }

  try {
    let url = "";

    if (orgId) {
      // Buscar eventos de uma organização pública
      url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`;
    } else {
      // Buscar eventos do usuário
      url = "https://www.eventbriteapi.com/v3/users/me/events/";
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Se 404 do Eventbrite (usuário sem eventos), retorna array vazio
      if (response.status === 404) {
        return NextResponse.json({ events: [] }, { status: 200 });
      }

      const errorData = await response.json();
      return NextResponse.json(
        { error: "Erro ao buscar eventos", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Garantir que sempre tenha "events" no retorno
    const events = data.events ?? [];

    // Retorna com cache: 60s s-maxage, 5min stale-while-revalidate
    return NextResponse.json(
      { events },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao conectar Eventbrite:", error);
    return NextResponse.json(
      { error: "Erro interno", details: error },
      { status: 500 }
    );
  }
}
