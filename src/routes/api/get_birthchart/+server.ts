import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Accede a las variables de entorno usando process.env
const backendUrl = process.env.VITE_BACKEND_URL;

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { user, birthDate, coordinates, token } = await request.json();

        // Realiza la solicitud al backend desde el servidor
        const response = await fetch(`${backendUrl}/api/get_birthchart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, birthDate, coordinates, token })
        });

        if (!response.ok) {
            const errorText = await response.text(); // Captura el mensaje de error del backend
            throw new Error(`Error en la solicitud: ${errorText}`);
        }

        const data = await response.json();
        return json(data);
    } catch (error) {
        console.error('Error en la solicitud al backend:', error);
        return json({
            error: error.message,
            backendUrl: backendUrl,
            status: 500
        }, { status: 500 }); // Enviar mensaje de error y URL del backend al cliente
    }
};
