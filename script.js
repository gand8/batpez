const PROXY_URL = "/.netlify/functions/coach";

// Registro del Service Worker (necesario para que funcione como PWA/offline)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('SW registrado ✅'))
            .catch(err => console.error('Error registrando SW:', err));
    });
}

function cambiarPantalla(pantallaId) {
    document.querySelectorAll('.pantalla').forEach(p => p.classList.add('oculto'));
    document.getElementById(pantallaId).classList.remove('oculto');
}

function verDia(dia) {
    document.getElementById('titulo-dia').innerText = dia;
    cambiarPantalla('pantalla-misiones');
}

function verCoach() { cambiarPantalla('pantalla-coach'); }

async function preguntarCoach() {
    const input = document.getElementById('input-pregunta');
    const respuestaDiv = document.getElementById('respuesta-coach');
    const pregunta = input.value.trim();

    if (!pregunta) return;

    respuestaDiv.innerText = "Pensando...";
    input.value = "";

    try {
        const res = await fetch(PROXY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Coach experto en productividad: " + pregunta }] }]
            })
        });

        const data = await res.json();
        if (data.candidates) {
            respuestaDiv.innerHTML = data.candidates[0].content.parts[0].text.replace(/\n/g, '<br>');
        } else if (data.error) {
            respuestaDiv.innerText = "Error: " + data.error;
        } else {
            respuestaDiv.innerText = "Error: No hubo respuesta.";
        }
    } catch (err) {
        respuestaDiv.innerText = "Fallo de conexión.";
    }
}