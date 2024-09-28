const express = require('express');
const cors = require('cors');  // Importar cors
const app = express();
const port = 3000;

const db = require('./db/connection');

app.use(cors());

app.use(express.json());

app.post('/estudiantes', (req, res) => {
    const { nombre, apellido, carnet } = req.body;

    if (!nombre || !apellido || !carnet) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const query = 'INSERT INTO estudiantes (nombre, apellido, carnet) VALUES (?, ?, ?)';
    db.query(query, [nombre, apellido, carnet], (err, result) => {
        if (err) {
            console.error('Error al insertar estudiante:', err);
            return res.status(500).send('Error al insertar estudiante');
        }
        const estudianteId = result.insertId;
        res.status(201).json({
            message: 'Estudiante insertado exitosamente',
            estudianteId: estudianteId
        });
    });
});

app.post('/cursos-estudiantes', (req, res) => {
    const { estudiante_id, curso, nota } = req.body;

    if (!estudiante_id || !curso || nota === undefined) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    const query = 'INSERT INTO cursos_estudiantes (estudiante_id, curso, nota) VALUES (?, ?, ?)';
    db.query(query, [estudiante_id, curso, nota], (err, result) => {
        if (err) {
            console.error('Error al insertar curso y nota:', err);
            return res.status(500).send('Error al insertar curso y nota');
        }
        res.status(201).send('Curso y nota insertados exitosamente');
    });
});

app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
