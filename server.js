require('dotenv').config();
console.log('URL de Supabase:', process.env.SUPABASE_URL)
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.post('/api/guardar', async (req, res) => {
    const { nombre, correo, telefono, fecha_nacimiento } = req.body;

    const  { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre, correo, telefono, fecha_nacimiento }])
    .select();

    if(error) {
        console.error('Error al insertar en Supabase', error.message);
        return res.status(500).json({ exito: false, error: error.message });
    }

    console.log('Registro guardado en Supabase:', data);
    res.json({
        mensaje: 'Regristro guardado con exito',
        datosRecibidos: data[0]
    });
});

app.get('/api/usuarios', async (req, res) =>{
    const {data,error} = await supabase
    .from('usuarios')
    .select('*');

    if(error){
        console.error('Error al consultar a Supabase: ', error.message);
        return res.status(500).json({ exito: false, error: error.message});
    }

    res.json({
        exito: true,
        usuarios: data
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
})