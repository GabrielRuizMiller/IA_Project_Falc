import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileBase64, fileName } = body;

    if (!fileBase64 || !fileName) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    console.log(' Imagen recibida:', fileName);
    console.log(' Base64 (inicio):', fileBase64.substring(0, 30), '...');

    // Simulación de IA
    return NextResponse.json({
      clase: 'Benigno',
      confianza: 0.89,
    });
  } catch (error) {
    console.error(' Error:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
