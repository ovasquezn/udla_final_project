import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    // El cuerpo de este mensaje al parecer presenta algunos errores para la carga del html, pendiente de arreglar
    await transport.sendMail({
        from: 'Bienes Raices',
        to: email,
        subject: 'Confirma tu cuenta',
        text: 'Confirma tu cuenta con nosotros',
        html: `
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center;">
                    <h1 stlye="font-size: 30px; color: #333;"> Grimu </h1>
                </div>
    
                <h2 style="font-size: 24px; color: #333;">Confirma tu cuenta</h1>
                <p style="font-size: 16px; color: #555;">Hola <strong>${nombre}</strong>, estás a solo un paso de activar tu cuenta en nuestra plataforma.</p>
    
                <p style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/autenticacion/confirmar/${token}" 
                    style="background-color: #28a745; color: #ffffff; padding: 12px 20px; text-decoration: none; font-weight: bold; border-radius: 5px;">
                    Confirmar cuenta
                    </a>
                </p>
    
                <p style="font-size: 14px; color: #777;">
                    Si no solicitaste esta cuenta, puedes ignorar este mensaje.
                </p>
            </div>
    
            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaa;">
                <p>&copy; ${new Date().getFullYear()} Grimu. Todos los derechos reservados.</p>
            </div>
        `,
    })
}    
const emailRecuperar = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    await transport.sendMail({
        from: 'Bienes Raices',
        to: email,
        subject: 'Cambia tu contraseña',
        text: 'Cambia tu contraseña',
        html: `
            <h1>Cambia tu contraseña</h1>
            <p>Hola ${nombre}, has solicitado reestablecer la contraseña</p>
            <p>Da click en el siguiente enlace:</p>
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/autenticacion/recuperar_contrasena/${token}">Confirmar cuenta</a>
        `
    })
}



export {
    emailRegistro,
    emailRecuperar
}