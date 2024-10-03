const express = require('express');
const cors = require('cors');  // Importar cors
const app = express();
const port = 3000;

const db = require('./db/connection');  // Conexión a la base de datos

app.use(cors());
app.use(express.json());

/**
 * Endpoint para obtener todos los estudiantes con sus respectivos cursos y notas
 */
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


/**
 * Endpoint para añadir un nuevo estudiante con su curso y nota
 */
app.post('/estudiantes', (req, res) => {
    const { nombre, apellido, carnet, curso, nota } = req.body;

    if (!nombre || !apellido || !carnet || !curso || nota === undefined) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    // Insertar estudiante
    const queryEstudiante = 'INSERT INTO estudiantes (nombre, apellido, carnet) VALUES (?, ?, ?)';
    db.query(queryEstudiante, [nombre, apellido, carnet], (err, result) => {
        if (err) {
            console.error('Error al insertar estudiante:', err);
            return res.status(500).send('Error al insertar estudiante');
        }

        const estudianteId = result.insertId;

        // Insertar curso y nota
        const queryCurso = 'INSERT INTO cursos_estudiantes (estudiante_id, curso, nota) VALUES (?, ?, ?)';
        db.query(queryCurso, [estudianteId, curso, nota], (err, result) => {
            if (err) {
                console.error('Error al insertar curso y nota:', err);
                return res.status(500).send('Error al insertar curso y nota');
            }

            res.status(201).json({
                message: 'Estudiante y curso insertados exitosamente',
                estudianteId: estudianteId
            });
        });
    });
});

/**
 * Endpoint para eliminar un estudiante (y sus cursos asociados)
 */
app.delete('/estudiantes/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM estudiantes WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar estudiante:', err);
            return res.status(500).send('Error al eliminar estudiante');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Estudiante no encontrado');
        }

        res.status(200).send('Estudiante eliminado exitosamente');
    });
});

/**
 * Endpoint para editar los datos de un estudiante y su curso
 */
app.put('/estudiantes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, carnet, curso, nota } = req.body;

    if (!nombre || !apellido || !carnet || !curso || nota === undefined) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    // Actualizar datos del estudiante
    const queryEstudiante = 'UPDATE estudiantes SET nombre = ?, apellido = ?, carnet = ? WHERE id = ?';
    db.query(queryEstudiante, [nombre, apellido, carnet, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar estudiante:', err);
            return res.status(500).send('Error al actualizar estudiante');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send('Estudiante no encontrado');
        }

        // Actualizar curso y nota del estudiante
        const queryCurso = 'UPDATE cursos_estudiantes SET curso = ?, nota = ? WHERE estudiante_id = ?';
        db.query(queryCurso, [curso, nota, id], (err, result) => {
            if (err) {
                console.error('Error al actualizar curso y nota:', err);
                return res.status(500).send('Error al actualizar curso y nota');
            }

            res.status(200).send('Estudiante y curso actualizados exitosamente');
        });
    });
});

/**
 * Endpoint original para añadir solo estudiantes
 */
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

/**
 * Endpoint original para añadir solo cursos y notas a estudiantes
 */
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

/**
 * Endpoint para la página principal
 */
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

/**
 * Iniciar servidor
 */
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
