// app/api/eventbrite/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Correto: Promise<{ id: string }>
) {
  const token = process.env.EVENTBRITE_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Token do Eventbrite não definido" },
      { status: 500 }
    );
  }

  const { id } = await params; // ✅ Agora você extrai o id de forma assíncrona

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const searchParams = new URLSearchParams({
      expand: "description,ticket_classes,logo,venue,format",
    });

    // ⚠️ Corrija o espaço no URL (havia um espaço antes de ${id})
    const url = `https://www.eventbriteapi.com/v3/events/${id}/?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
      }

      const errorText = await response.text();
      console.error("Erro na API do Eventbrite (evento único):", errorText);
      return NextResponse.json({ error: "Erro ao carregar evento" }, { status: response.status });
    }

    const event = await response.json();

    return NextResponse.json(
      { event },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Erro inesperado ao buscar evento:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}