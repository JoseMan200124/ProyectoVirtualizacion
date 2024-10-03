document.addEventListener('DOMContentLoaded', cargarEstudiantes);

// Función para cargar los estudiantes desde el backend
async function cargarEstudiantes() {
    try {
        const response = await fetch('http://localhost:3000/estudiantes-cursos');
        const estudiantes = await response.json();

        estudiantes.forEach(estudiante => {
            agregarFilaTabla(estudiante.id, estudiante.nombre, estudiante.apellido, estudiante.carnet, estudiante.curso, estudiante.nota);
        });
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
    }
}

// Función para agregar un estudiante basado en los datos ingresados por el usuario
document.getElementById('agregar-btn').addEventListener('click', async function () {
    const nombre = document.getElementById('input-nombre').value;
    const apellido = document.getElementById('input-apellido').value;
    const carnet = document.getElementById('input-carnet').value;
    const curso = document.getElementById('input-curso').value;
    const nota = document.getElementById('input-nota').value;

    if (nombre && apellido && carnet && curso && nota) {
        const nuevoEstudiante = {
            nombre,
            apellido,
            carnet,
            curso,
            nota
        };

        try {
            const response = await fetch('http://localhost:3000/estudiantes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoEstudiante)
            });

            if (response.ok) {
                const estudiante = await response.json();
                agregarFilaTabla(estudiante.estudianteId, nombre, apellido, carnet, curso, nota);
                limpiarFormulario();
            } else {
                alert('Error al agregar el estudiante');
            }
        } catch (error) {
            console.error('Error al agregar estudiante:', error);
        }
    } else {
        alert('Por favor, completa todos los campos');
    }
});

// Limpiar los campos del formulario después de agregar un estudiante
function limpiarFormulario() {
    document.getElementById('input-nombre').value = '';
    document.getElementById('input-apellido').value = '';
    document.getElementById('input-carnet').value = '';
    document.getElementById('input-curso').value = '';
    document.getElementById('input-nota').value = '';
}

// Función para agregar una fila a la tabla con animación
function agregarFilaTabla(id, nombre, apellido, carnet, curso, nota) {
    const tabla = document.getElementById('tabla-estudiantes').getElementsByTagName('tbody')[0];
    const nuevaFila = tabla.insertRow();

    nuevaFila.innerHTML = `
        <td contenteditable="false">${nombre}</td>
        <td contenteditable="false">${apellido}</td>
        <td contenteditable="false">${carnet}</td>
        <td contenteditable="false">${curso}</td>
        <td contenteditable="false">${nota}</td>
        <td>
            <button onclick="editarEstudiante(this, ${id})">Editar</button>
            <button onclick="eliminarEstudiante(this, ${id})">Eliminar</button>
        </td>
    `;

    nuevaFila.classList.add('nueva-fila');
    setTimeout(() => {
        nuevaFila.classList.remove('nueva-fila');
    }, 500); // Tiempo de animación
}

// Función para eliminar un estudiante con animación
async function eliminarEstudiante(boton, id) {
    try {
        const response = await fetch(`http://localhost:3000/estudiantes/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const fila = boton.parentNode.parentNode;
            fila.classList.add('eliminar-fila');
            setTimeout(() => {
                fila.parentNode.removeChild(fila);
            }, 500);
        } else {
            alert('Error al eliminar el estudiante');
        }
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
    }
}

// Función para editar un estudiante
function editarEstudiante(boton, id) {
    const fila = boton.parentNode.parentNode;

    if (boton.textContent === "Editar") {
        // Hacer todos los campos de la fila editables
        for (let i = 0; i < fila.cells.length - 1; i++) {
            fila.cells[i].setAttribute('contenteditable', 'true');
            fila.cells[i].classList.add('editable');
        }

        boton.textContent = "Guardar";
    } else {
        // Obtener los nuevos valores
        const nombre = fila.cells[0].textContent;
        const apellido = fila.cells[1].textContent;
        const carnet = fila.cells[2].textContent;
        const curso = fila.cells[3].textContent;
        const nota = fila.cells[4].textContent;

        const estudianteActualizado = {
            nombre,
            apellido,
            carnet,
            curso,
            nota
        };

        // Hacer la solicitud PUT para actualizar los datos en el servidor
        fetch(`http://localhost:3000/estudiantes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(estudianteActualizado)
        }).then(response => {
            if (response.ok) {
                alert('Estudiante actualizado correctamente');
                for (let i = 0; i < fila.cells.length - 1; i++) {
                    fila.cells[i].setAttribute('contenteditable', 'false');
                    fila.cells[i].classList.remove('editable');
                }
                boton.textContent = "Editar";
            } else {
                alert('Error al actualizar el estudiante');
            }
        }).catch(error => {
            console.error('Error al actualizar estudiante:', error);
        });
    }
}
