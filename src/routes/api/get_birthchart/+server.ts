import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

// Usa import.meta.env para acceder a la variable de entorno
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const POST: RequestHandler = async ({ request }) => {
    try {
        // Desestructurar birthDateTime de la solicitud
        const { user, birthDateTime, coordinates, token } = await request.json();

        // Realiza la solicitud al backend desde el servidor
        const response = await fetch(`${backendUrl}/api/get_birthchart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, birthDateTime, coordinates, token }) // Usar birthDateTime directamente
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
