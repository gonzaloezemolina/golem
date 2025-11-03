import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("🔔 WEBHOOK INICIADO");
  
  try {
    const body = await request.json();
    console.log("📦 Body recibido:", JSON.stringify(body, null, 2));

    // Por ahora solo devolver OK
    return NextResponse.json({ 
      success: true,
      message: "Webhook recibido correctamente" 
    });

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 200 });
  }
}