<template>
  <div class="admin-panel d-flex">
    <div class="main-content flex-grow-1">
      <!-- Barra de navegación admin -->
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <router-link class="navbar-brand fw-bold" to="/admin">
            <i class="bi bi-shield-lock"></i> Panel de Administración
          </router-link>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="adminNavbar">
            <ul class="navbar-nav me-auto">
            </ul>
            <ul class="navbar-nav">
              <li class="nav-item me-3">
                <router-link class="nav-link text-white" to="/productos">
                  <i class="bi bi-house-door"></i> Inicio
                </router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white" href="#" @click.prevent="cerrarSesion">
                  <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="conta py-4">
        <div class="row">
          <!-- Gestión de Libros -->
          <div class="col-12 mb-4">
            <div class="card shadow-sm">
              <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h2 class="card-title mb-0 fw-bold text-primary">Gestión de Stock</h2>
                <button class="btn btn-primary" @click="showAddBookModal">
                  <i class="bi bi-plus-circle-fill me-2"></i>Añadir Libro
                </button>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Autor</th>
                        <th>Stock</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Descuento</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="book in books" :key="book.id">
                        <td class="text-center"><span class="firestore-id">{{ book.id }}</span></td>
                        <td class="text-center">{{ book.title }}</td>
                        <td class="text-center">{{ book.author }}</td>
                        <td class="text-center">
                          <input 
                            type="number" 
                            v-model.number="book.stock"
                            class="form-control form-control-sm"
                            min="0"
                            @change="updateStock(book)"
                          >
                        </td>
                        <td>
                          <div class="input-group input-group-sm">
                            <span class="input-group-text">$</span>
                            <input 
                              type="number" 
                              v-model.number="book.price"
                              class="form-control form-control-sm"
                              min="0"
                              step="0.01"
                              @change="updateBook(book)"
                            >
                          </div>
                        </td>
                        <td>
                          <select 
                            v-model="book.status" 
                            class="form-select form-select-sm"
                            @change="updateBook(book)"
                          >
                            <option value="available">Disponible</option>
                            <option value="upcoming">Próximamente</option>
                            <option value="outOfStock">Agotado</option>
                          </select>
                        </td>
                        <td>
                          <div class="input-group input-group-sm">
                            <input 
                              type="number" 
                              v-model.number="book.discountPercentage"
                              class="form-control form-control-sm"
                              min="0"
                              max="100"
                              @change="updateBook(book)"
                            >
                            <span class="input-group-text">%</span>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-warning" @click="editBook(book)">
                              <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-outline-danger" @click="deleteBook(book.id)">
                              <i class="bi bi-trash"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Gestión de Eventos -->
          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h2 class="card-title mb-0 fw-bold text-primary">Gestión de Eventos</h2>
                <button class="btn btn-success" @click="showAddEventModal">
                  <i class="bi bi-calendar-plus-fill me-2"></i>Añadir Evento
                </button>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>Título</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Ubicación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="event in events" :key="event.id">
                        <td>{{ event.title }}</td>
                        <td>{{ formatEventDate(event.date) }}</td>
                        <td>{{ event.time }}</td>
                        <td>{{ event.location }}</td>
                        <td>
                          <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-warning" @click="editEvent(event)">
                              <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-danger" @click="deleteEvent(event.id)">
                              <i class="bi bi-trash"></i> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para añadir/editar libro -->
    <div class="modal fade" id="bookModal" tabindex="-1" ref="bookModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title">
              <i class="bi bi-book me-2"></i>
              {{ editMode ? 'Editar' : 'Añadir' }} Libro
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body custom-form">
            <form @submit.prevent="saveBook">
              <div class="mb-4">
                <label class="form-label fw-bold">Título</label>
                <input v-model="newBook.title" type="text" class="form-control custom-input" required>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Autor</label>
                <input v-model="newBook.author" type="text" class="form-control custom-input" required>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Descripción</label>
                <textarea v-model="newBook.description" class="form-control custom-input" rows="3" required></textarea>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Precio</label>
                <div class="input-group">
                  <span class="input-group-text custom-input-group">$</span>
                  <input v-model.number="newBook.price" type="number" step="0.01" class="form-control custom-input" required>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Stock</label>
                <input v-model.number="newBook.stock" type="number" class="form-control custom-input" required>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Estado</label>
                <select v-model="newBook.status" class="form-select custom-select" required>
                  <option value="available">Disponible</option>
                  <option value="upcoming">Próximamente</option>
                  <option value="outOfStock">Agotado</option>
                </select>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">URL de la imagen</label>
                <input v-model="newBook.imageUrl" type="url" class="form-control custom-input" required>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Descuento (%)</label>
                <input v-model.number="newBook.discountPercentage" type="number" min="0" max="100" class="form-control custom-input">
              </div>
              <div v-if="newBook.status === 'upcoming'" class="mb-4">
                <label class="form-label fw-bold">Fecha de lanzamiento</label>
                <input v-model="newBook.releaseDate" type="date" class="form-control custom-input" required>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-outline-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-primary">{{ editMode ? 'Actualizar' : 'Guardar' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para añadir/editar evento -->
    <div class="modal fade" id="eventModal" tabindex="-1" ref="eventModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-light">
            <h5 class="modal-title">
              <i class="bi bi-calendar-event me-2"></i>
              {{ editEventMode ? 'Editar' : 'Añadir' }} Evento
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body custom-form">
            <form @submit.prevent="saveEvent">
              <div class="mb-4">
                <label class="form-label fw-bold">Título</label>
                <input v-model="newEvent.title" type="text" class="form-control custom-input" required>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Descripción</label>
                <textarea v-model="newEvent.description" class="form-control custom-input" rows="3" required></textarea>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Fecha</label>
                <input v-model="newEvent.date" type="date" class="form-control custom-input" required>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Hora</label>
                <input v-model="newEvent.time" type="time" class="form-control custom-input" required>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">Ubicación</label>
                <input v-model="newEvent.location" type="text" class="form-control custom-input" required>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">URL de la imagen</label>
                <input v-model="newEvent.imageUrl" type="url" class="form-control custom-input" required>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-outline-secondary me-2" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" class="btn btn-success">{{ editEventMode ? 'Actualizar' : 'Guardar' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'
import { db, auth } from '../firebase/config'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminPanelView',
  data() {
    return {
      books: [],
      events: [],
      modal: null,
      eventModal: null,
      editMode: false,
      editEventMode: false,
      newBook: {
        title: '',
        author: '',
        description: '',
        stock: 0,
        price: 0,
        status: 'available',
        discountPercentage: 0,
        releaseDate: null,
        imageUrl: ''
      },
      newEvent: {
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        imageUrl: ''
      }
    }
  },
  created() {
    this.loadBooks()
    this.loadEvents()
    this.router = useRouter()
  },
  mounted() {
    this.modal = new Modal(document.getElementById('bookModal'))
    this.eventModal = new Modal(document.getElementById('eventModal'))
  },
  methods: {
    async loadBooks() {
      try {
        const booksCollection = collection(db, 'books')
        const querySnapshot = await getDocs(booksCollection)
        this.books = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error al cargar libros:', error)
        alert('Error al cargar los libros')
      }
    },
    async loadEvents() {
      try {
        const eventsCollection = collection(db, 'events')
        const querySnapshot = await getDocs(eventsCollection)
        this.events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      } catch (error) {
        console.error('Error al cargar eventos:', error)
        alert('Error al cargar los eventos')
      }
    },
    showAddBookModal() {
      this.editMode = false;
      this.newBook = {
        title: '',
        author: '',
        stock: 0,
        price: 0,
        status: 'available',
        discountPercentage: 0,
        releaseDate: null,
        imageUrl: ''
      }
      this.modal.show()
    },
    async updateStock(book) {
      try {
        // Actualizar stock en Firebase
        console.log(`Actualizando stock: ${book.id} -> ${book.stock}`)
        // await updateDoc(bookRef, { stock: book.stock })
      } catch (error) {
        console.error('Error al actualizar stock:', error)
      }
    },
    async updateBook(book) {
      try {
        const bookRef = doc(db, 'books', book.id)
        // Calcular precio con descuento si aplica
        if (book.discountPercentage > 0) {
          book.discountedPrice = book.price * (1 - book.discountPercentage / 100)
        }
        
        const bookData = { ...book }
        delete bookData.id // Removemos el id ya que es la referencia del documento
        
        await updateDoc(bookRef, bookData)
        console.log('Libro actualizado exitosamente')
      } catch (error) {
        console.error('Error al actualizar libro:', error)
        alert('Error al actualizar el libro')
      }
    },
    editBook(book) {
      this.editMode = true
      this.newBook = { ...book }
      this.modal.show()
    },
    async deleteBook(bookId) {
      if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
        try {
          const bookRef = doc(db, 'books', bookId)
          await deleteDoc(bookRef)
          this.books = this.books.filter(b => b.id !== bookId)
          console.log('Libro eliminado exitosamente')
        } catch (error) {
          console.error('Error al eliminar libro:', error)
          alert('Error al eliminar el libro')
        }
      }
    },

    async cerrarSesion() {
      try {
        await signOut(auth)
        this.router.push('/login')
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
    },
    async saveBook() {
      try {
        // Validar precio y stock
        if (this.newBook.price < 0 || this.newBook.stock < 0) {
          alert('El precio y el stock no pueden ser negativos')
          return
        }

        if (this.newBook.id) {
          // Actualizar libro existente
          await this.updateBook(this.newBook)
        } else {
          // Crear nuevo libro
          const newBookData = {
            ...this.newBook,
            createdAt: new Date().toISOString()
          }
          const booksCollection = collection(db, 'books')
          await addDoc(booksCollection, newBookData)
          console.log('Nuevo libro creado exitosamente')
        }

        // Cerrar modal y recargar lista
        this.modal.hide()
        await this.loadBooks()
      } catch (error) {
        console.error('Error al guardar libro:', error)
        alert('Error al guardar el libro')
      }
    },
    showAddEventModal() {
      this.editEventMode = false;
      this.newEvent = {
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        imageUrl: ''
      }
      this.eventModal.show()
    },
    editEvent(event) {
      this.editEventMode = true;
      this.newEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date instanceof Date ? event.date.toISOString().split('T')[0] : event.date,
        time: event.time,
        location: event.location,
        imageUrl: event.imageUrl
      }
      this.eventModal.show()
    },
    async deleteEvent(eventId) {
      if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        try {
          const eventRef = doc(db, 'events', eventId)
          await deleteDoc(eventRef)
          this.events = this.events.filter(e => e.id !== eventId)
          console.log('Evento eliminado exitosamente')
        } catch (error) {
          console.error('Error al eliminar evento:', error)
          alert('Error al eliminar el evento')
        }
      }
    },
    async saveEvent() {
      try {
        const eventData = {
          ...this.newEvent,
          createdAt: new Date().toISOString()
        }
        delete eventData.id // Removemos el id si existe

        if (this.newEvent.id) {
          // Actualizar evento existente
          const eventRef = doc(db, 'events', this.newEvent.id)
          await updateDoc(eventRef, eventData)
          console.log('Evento actualizado exitosamente')
        } else {
          // Crear nuevo evento
          const eventsCollection = collection(db, 'events')
          await addDoc(eventsCollection, eventData)
          console.log('Nuevo evento creado exitosamente')
        }

        // Cerrar modal y recargar lista
        this.eventModal.hide()
        await this.loadEvents()
      } catch (error) {
        console.error('Error al guardar evento:', error)
        alert('Error al guardar el evento')
      }
    },
    formatEventDate(date) {
      if (!date) return '';
      try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return '';
      }
    }
  }
}
</script>

<style scoped>
.admin-panel {
  background: linear-gradient(135deg, var(--primary-bg) 0%, #0d1b2a 50%, var(--primary-bg) 100%);
  background-attachment: fixed;
  min-height: 100vh;
  color: var(--text-primary);
}

.main-content {
  background: transparent;
}

.navbar {
  background: var(--glass-effect) !important;
  border-bottom: 2px solid var(--glass-border);
  backdrop-filter: blur(10px);
}

.navbar-brand,
.nav-link {
  color: var(--text-primary) !important;
}

.conta {
  min-width: 1250px;
  padding: 2rem 1rem;
}

.card {
  background: var(--glass-effect);
  border: 2px solid var(--glass-border);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 25px rgba(76, 201, 240, 0.2);
  border-color: var(--accent-color);
}

.card-header {
  background: linear-gradient(135deg, rgba(76, 201, 240, 0.1), rgba(114, 9, 183, 0.1)) !important;
  border-bottom: 2px solid var(--glass-border);
}

.card-title {
  color: var(--accent-color);
  font-family: 'Orbitron', sans-serif;
}

.table {
  color: var(--text-primary);
}

.table th {
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--glass-border);
  color: var(--text-primary);
}

.table td {
  background: rgba(255, 255, 255, 0.03);
  border-color: var(--glass-border);
  color: var(--text-primary);
}

.form-control-sm {
  width: 80px;
  background: var(--glass-effect);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}

.form-control-sm:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-color);
  box-shadow: 0 0 0 0.2rem rgba(76, 201, 240, 0.25);
  color: var(--text-primary);
}

.form-select {
  background: var(--glass-effect);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}

.form-select:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-color);
  box-shadow: 0 0 0 0.2rem rgba(76, 201, 240, 0.25);
  color: var(--text-primary);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), var(--hover-btn));
  border: none;
  color: var(--primary-bg);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 201, 240, 0.5);
  background: linear-gradient(135deg, var(--hover-btn), var(--accent-color));
}

.btn-success {
  background: linear-gradient(135deg, var(--success-color), #22c55e);
  border: none;
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(74, 222, 128, 0.5);
  background: linear-gradient(135deg, #22c55e, var(--success-color));
}

.btn-warning {
  background: linear-gradient(135deg, var(--warning-color), #f59e0b);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.btn-danger {
  background: linear-gradient(135deg, var(--error-color), #dc2626);
  border: none;
  color: white;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(248, 113, 113, 0.3);
}

.btn-outline-warning {
  color: var(--accent-color);
  border-color: var(--accent-color);
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-warning:hover {
  background: var(--accent-color);
  color: var(--primary-bg);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);
}

.btn-outline-danger {
  color: var(--error-color);
  border-color: var(--error-color);
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  background: var(--error-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(248, 113, 113, 0.3);
}

.table-hover tbody tr:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-color);
}

.gap-2 {
  gap: 0.5rem !important;
}

.custom-input,
.custom-select {
  background: var(--glass-effect);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}

.custom-input:focus,
.custom-select:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-color);
  box-shadow: 0 0 0 0.2rem rgba(76, 201, 240, 0.25);
  color: var(--text-primary);
}

.custom-input-group {
  background: var(--glass-effect);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
}

.modal-content {
  background: var(--secondary-bg);
  border: 2px solid var(--glass-border);
  color: var(--text-primary);
}

.modal-header {
  background: linear-gradient(135deg, rgba(76, 201, 240, 0.1), rgba(114, 9, 183, 0.1)) !important;
  border-bottom: 2px solid var(--glass-border);
}

.modal-title {
  color: var(--text-primary);
}

.btn-close {
  filter: invert(1);
}

.modal-content {
  backdrop-filter: blur(10px);
}

.modal-header {
  border-bottom: 2px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.1);
}

.form-label {
  color: #e9ecef;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-control,
.form-select {
  background: var(--glass-effect);
  border: 1px solid var(--glass-border);
  color: #fff;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-control:focus,
.form-select:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--accent-color);
  box-shadow: 0 0 0 0.2rem rgba(76, 201, 240, 0.25);
  color: #fff;
}

.input-group-text {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--glass-border);
  color: #ff0000;
}

/* Estilos para la sección de gestión */
.card-header h2 {
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 1.5rem;
}

.table {
  margin-top: 1rem;
}

.table th {
  color: var(--accent-color);
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  padding: 1rem;
}

.table td {
  color: #4CC9F0;
  padding: 1rem;
  vertical-align: middle;
  font-weight: 500;
  text-shadow: 0 0 10px rgba(76, 201, 240, 0.3);
}

.table td small {
  color: rgba(76, 201, 240, 0.7);
}

/* Estilo específico para los datos de Firestore */
.table tbody tr td:not(:has(input)):not(:has(select)):not(:has(button)) {
  color: #4CC9F0;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

/* Estilos para el formulario modal */
.custom-form {
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(29, 53, 87, 0.95) 0%, rgba(32, 58, 96, 0.95) 100%);
  border-radius: 12px;
}

.custom-input,
.custom-select {
  background: rgba(20, 39, 78, 0.6);
  border: 1px solid rgba(76, 201, 240, 0.2);
  color: #4CC9F0;
  border-radius: 8px;
  font-weight: 500;
}

.custom-input:focus,
.custom-select:focus {
  background: rgba(25, 45, 90, 0.7);
  border-color: var(--accent-color);
  color: #4CC9F0;
  box-shadow: 0 0 0 0.2rem rgba(76, 201, 240, 0.15);
}

.custom-select option {
  background: #1d3557;
  color: #4CC9F0;
}

.custom-input-group {
  /* background: rgba(20, 39, 78, 0.6); */
  border: 1px solid rgba(76, 201, 240, 0.2);
  color: #4CC9F0;
}

/* Estilos para las celdas de la tabla */
.table td .form-control-sm {
  border: 1px solid rgba(76, 201, 240, 0.2);
  color: #4CC9F0;
  transition: all 0.3s ease;
  font-weight: 500;
}

.table td .form-control-sm:focus {
  background: rgba(25, 45, 90, 0.7);
  border-color: var(--accent-color);
  box-shadow: 0 0 10px rgba(76, 201, 240, 0.2);
}

.table td .input-group-sm .input-group-text {
  border: 1px solid rgba(76, 201, 240, 0.2);
  color: #4CC9F0;
}

.table td select.form-select-sm {
  border: 1px solid rgba(76, 201, 240, 0.2);
  color: #4CC9F0;
  font-weight: 500;
}

.table td select.form-select-sm:focus {
  background: rgba(25, 45, 90, 0.7);
  border-color: var(--accent-color);
  box-shadow: 0 0 10px rgba(76, 201, 240, 0.2);
}

/* Animaciones y efectos hover */
.table tbody tr {
  transition: all 0.3s ease;
}

.table tbody tr:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn {
  padding: 0.5rem 1.5rem;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
}
</style>