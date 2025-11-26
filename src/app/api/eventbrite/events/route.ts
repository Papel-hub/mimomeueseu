// eventbrite/events/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.EVENTBRITE_TOKEN;
  const orgId = process.env.EVENTBRITE_ORG_ID?.trim();

  if (!token) {
    return NextResponse.json(
      { error: "Token do Eventbrite não definido" },
      { status: 500 }
    );
  }

  try {
    // 👇 Parâmetros de expansão essenciais
    const params = new URLSearchParams({
      expand: "ticket_classes,logo", // ← isso é crucial!
    });

    let url = "";
    if (orgId && orgId.length > 0) {
      url = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?${params.toString()}`;
    } else {
      url = `https://www.eventbriteapi.com/v3/users/me/events/?${params.toString()}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // 👇 Evita que o Next.js cacheie a requisição para a API externa
      next: { revalidate: 60 }, // compatível com o Cache-Control abaixo
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ events: [] }, { status: 200 });
      }

      const errorData = await response.text(); // Eventbrite as vezes retorna HTML em erros
      console.error("Erro da API do Eventbrite:", errorData);
      return NextResponse.json(
        { error: "Erro ao buscar eventos" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const events = data.events ?? [];

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
      { error: "Erro interno" }, // ← nunca exponha `error` diretamente
      { status: 500 }
    );
  }
}