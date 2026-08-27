const formulario = document.getElementById('formulario');
const resultado = document.getElementById('tarjeta_resultado');

async function obtenerUsuarios() {
    try{
        const respuesta = await fetch('/api/usuarios');
        const datos = await respuesta.json();

        if (datos.exito) {
            console.log('Lista de usuarios de la base: ', datos.usuarios);
        }
    } catch (error) {
        console.error('Error al obtener usuarios: ', error);
    }
}

formulario.addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const telefonoInput = document.getElementById('telefono').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const telefono = telefonoInput ? parseInt(telefonoInput, 10) : null;

    try {
        const respuesta = await fetch('/api/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, correo, telefono, fecha_nacimiento })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            resultado.innerHTML = `
                <h3 style="color: #28a745;">${datos.mensaje}</h3>
                <p><strong>ID asignado por BD:</strong> ${datos.datosRecibidos.id}</p>
                <p><strong>Nombre:</strong> ${datos.datosRecibidos.nombre}</p>
                <p><strong>Correo:</strong> ${datos.datosRecibidos.correo}</p>
            `;
            formulario.reset();
            // Volvemos a consultar para verificar que se guardó
            obtenerUsuarios();
        } else {
            resultado.innerHTML = `<p style="color: red;">Error BD: ${datos.error}</p>`;
        }
    } catch (error) {
        resultado.innerHTML = `<p style="color: red;">Error de conexión con el servidor.</p>`;
    }
});
obtenerUsuarios();