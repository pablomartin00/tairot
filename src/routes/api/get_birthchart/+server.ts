import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const backendUrl = import.meta.env.VITE_BACKEND_URL; // Acceder a la variable de entorno

// Log de la variable de entorno
console.log('Backend URL:', backendUrl);

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { user, birthDate, coordinates, token } = await request.json();

        // Log de los datos que se envían
        console.log('Datos enviados al backend:', { user, birthDate, coordinates, token });

        // Realiza la solicitud al backend desde el servidor
        const response = await fetch(`${backendUrl}/api/get_birthchart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user, birthDate, coordinates, token }) // Incluye todos los datos del consultante y el token
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        // Log de la respuesta del backend
        console.log('Respuesta del backend:', data);

        return json(data);
    } catch (error) {
        console.error('Error en la solicitud al backend:', error);
        return json({ error: 'Error en la solicitud al backend' }, { status: 500 });
    }
};
