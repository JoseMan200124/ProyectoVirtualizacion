document.getElementById('formulario').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('fname').value;
    const apellido = document.getElementById('lname').value;
    const carnet = document.getElementById('carnet').value;
    const curso = document.getElementById('curso').value;
    const nota = document.getElementById('nota').value;

    try {
        const estudianteResponse = await fetch('http://34.135.118.84/api/estudiantes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                apellido: apellido,
                carnet: carnet
            })
        });

        const estudianteData = await estudianteResponse.json();

        if (estudianteResponse.ok) {
            const estudianteId = estudianteData.estudianteId;

            const cursoResponse = await fetch(`http://34.135.118.84/api/cursos-estudiantes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    estudiante_id: estudianteId,
                    curso: curso,
                    nota: nota
                })
            });

            if (cursoResponse.ok) {
                alert('Estudiante y curso insertados exitosamente');
            } else {
                alert('Error al insertar el curso');
            }
        } else {
            alert('Error al insertar el estudiante');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});