import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND)

export async function POST(request: Request) {
  try {
    const { name, email, category, message } = await request.json()

    // Validar campos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    // Enviar email
    const { data, error } = await resend.emails.send({
      from: "GOLEM Contacto <onboarding@resend.dev>", // Cambiar cuando verifiques dominio
      to: "gonzaloezemolina@gmail.com", // Tu email para recibir consultas
      replyTo: email, // Para responder directo al cliente
      subject: `Contacto - ${category || 'Consulta'} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #0a0a0a; color: white; padding: 20px; border-radius: 8px;">
              <h1 style="color: #d3b05c; margin-bottom: 20px;">Nueva consulta desde la web</h1>
              
              <div style="background: #1a1a1a; padding: 15px; border-radius: 6px; margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong>Nombre:</strong> ${name}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Categoría:</strong> ${category || 'General'}</p>
              </div>

              <div style="background: #1a1a1a; padding: 15px; border-radius: 6px;">
                <p style="margin: 0 0 10px 0;"><strong>Mensaje:</strong></p>
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888;">
                <p>Este email fue enviado desde el formulario de contacto de GOLEM</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("Error al enviar email:", error)
      return NextResponse.json(
        { error: "Error al enviar el mensaje" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: "Mensaje enviado correctamente" 
    })

  } catch (error: any) {
    console.error("Error en API contact:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}