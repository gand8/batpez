exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return { 
            statusCode: 405, 
            body: JSON.stringify({ error: "Método no permitido" }) 
        };
    }

    try {
        const body = JSON.parse(event.body);
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Falta configurar la variable GEMINI_API_KEY en Netlify." })
            };
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const respuesta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        if (!respuesta.ok) {
            const errorTxt = await respuesta.text();
            return {
                statusCode: respuesta.status,
                body: JSON.stringify({ error: `Error de Gemini: ${errorTxt}` })
            };
        }

        const datos = await respuesta.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Fallo en el proxy: ${error.message}` })
        };
    }
};