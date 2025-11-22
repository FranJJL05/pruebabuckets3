/**
 * La Lista de Lectura - Implementación
 */

class Libro {
    constructor(titulo, genero, autor) {
        this.titulo = titulo;
        this.genero = genero;
        this.autor = autor;
        this.leido = false;
        this.fechaLectura = null;
    }
}

class ListaLibros {
    constructor() {
        this.todosLosLibros = [];
        this.librosLeidos = 0;
        this.librosNoLeidos = 0;
        this.libroActual = null;
        this.siguienteLibro = null;
        this.ultimoLibro = null;
    }

    agregar(libro) {
        this.todosLosLibros.push(libro);
        this.librosNoLeidos++;

        // Si es el primer libro, se convierte en el libro actual
        if (!this.libroActual) {
            this.libroActual = libro;
        }
        // Si hay un libro actual pero no siguiente, este se convierte en el siguiente
        else if (!this.siguienteLibro) {
            this.siguienteLibro = libro;
        }
    }

    terminarLibroActual() {
        if (!this.libroActual) return;

        // 1. Marcar libro actual como leído
        this.libroActual.leido = true;
        this.libroActual.fechaLectura = new Date(Date.now());
        this.librosLeidos++;
        this.librosNoLeidos--;

        // 2. Cambiar último libro leído
        this.ultimoLibro = this.libroActual;

        // 3. Cambiar libro actual al siguiente libro
        this.libroActual = this.siguienteLibro;

        // 4. Cambiar siguiente libro al primer libro no leído encontrado
        // Buscamos el primer libro que NO esté leído y que NO sea el nuevo libro actual
        this.siguienteLibro = this.todosLosLibros.find(libro => !libro.leido && libro !== this.libroActual) || null;
    }
}

// --- Lógica de UI / DOM ---

const miListaLibros = new ListaLibros();

const inputTitulo = document.getElementById('title');
const inputAutor = document.getElementById('author');
const inputGenero = document.getElementById('genre');
const formularioAgregarLibro = document.getElementById('add-book-form');
const contenedorListaLibros = document.getElementById('book-list-container');
const elementoContadorLibros = document.getElementById('books-read-count');

// Ayudante para formatear fecha
function formatearFecha(fecha) {
    if (!fecha) return '';
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return fecha.toLocaleDateString('es-ES', opciones);
}

function renderizarListaLibros() {
    contenedorListaLibros.innerHTML = '';

    miListaLibros.todosLosLibros.forEach(libro => {
        const itemLibro = document.createElement('div');
        itemLibro.className = 'book-item';

        // Texto de estado
        let textoEstado = 'No Leído';
        if (libro.leido) {
            textoEstado = `Leído el ${formatearFecha(libro.fechaLectura)}`;
        } else if (libro === miListaLibros.libroActual) {
            textoEstado = 'Leyendo actual... (Click para terminar)';
        }

        itemLibro.innerHTML = `
            <div class="book-info">
                <h3>${libro.titulo}</h3>
                <p>${libro.autor}</p>
            </div>
            <div class="book-status ${libro.leido ? 'read' : 'unread'}">
                ${textoEstado}
            </div>
        `;

        // Evento click para marcar como leído (solo si es el libro actual y no está leído)
        if (libro === miListaLibros.libroActual && !libro.leido) {
            itemLibro.addEventListener('click', () => {
                miListaLibros.terminarLibroActual();
                renderizarListaLibros();
                actualizarFooter();
            });
            itemLibro.title = "Click para marcar como leído";
        }

        contenedorListaLibros.appendChild(itemLibro);
    });
}

function actualizarFooter() {
    elementoContadorLibros.textContent = `Libros Leídos: ${miListaLibros.librosLeidos} de ${miListaLibros.todosLosLibros.length}`;
}

formularioAgregarLibro.addEventListener('submit', (e) => {
    e.preventDefault();

    const titulo = inputTitulo.value;
    const autor = inputAutor.value;
    const genero = inputGenero.value;

    if (titulo && autor && genero) {
        const nuevoLibro = new Libro(titulo, genero, autor);
        miListaLibros.agregar(nuevoLibro);

        // Limpiar inputs
        inputTitulo.value = '';
        inputAutor.value = '';
        inputGenero.value = '';

        renderizarListaLibros();
        actualizarFooter();
    }
});

// Renderizado inicial
renderizarListaLibros();
actualizarFooter();
