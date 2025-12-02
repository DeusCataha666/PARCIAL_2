<template>
  <div class="admin-panel d-flex">
    <div class="main-content flex-grow-1">

      <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
          <router-link class="navbar-brand text-warning fw-bold" to="/admin">
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
                  <button class="btn btn-primary">
                    <i class="bi bi-house-door"></i> Inicio
                  </button>
                </router-link>
              </li>
              <li class="nav-item">
                <a class="nav-link text-white" href="#" @click.prevent="cerrarSesion">
                  <button class="btn btn-danger">
                    <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                  </button>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="conta py-4">
        <div class="row">

          <div class="col-12 ">
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
                        <td class="text-center"> <span class="firestore-id">{{ book.id.substring(0, 8) }}</span> </td>
                        <td class="text-center">{{ book.title }}</td>
                        <td class="text-center">{{ book.author }}</td>
                        <td class="text-center">
                          <input type="number" v-model.number="book.stock" class="form-control form-control-sm" min="0"
                            @change="updateStock(book)">
                        </td>
                        <td>
                          <div class="input-group input-group-sm">
                            <span class="input-group-text">$</span>
                            <input type="number" v-model.number="book.price" class="form-control form-control-sm"
                              min="0" step="0.01" @change="updateBook(book)">
                          </div>
                        </td>
                        <td>
                          <select v-model="book.status" class="form-select form-select-sm" @change="updateBook(book)">
                            <option value="available">Disponible</option>
                            <option value="upcoming">Próximamente</option>
                            <option value="outOfStock">Agotado</option>
                          </select>
                        </td>
                        <td>
                          <div class="input-group input-group-sm">
                            <input type="number" v-model.number="book.discountPercentage"
                              class="form-control form-control-sm" min="0" max="100" @change="updateBook(book)">
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


          <div class="col-12">
            <div class="card shadow-sm">
              <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h2 class="card-title mb-0 fw-bold text-primary">Gestión de Eventos</h2>
                <button class="btn btn-primary" @click="showAddEventModal">
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
                            <button class="btn btn-sm btn-outline-warning" @click="editEvent(event)">
                              <i class="bi bi-pencil"></i> Editar
                            </button>
                            <button class="btn btn-sm btn-outline-danger" @click="deleteEvent(event.id)">
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
                  <input v-model.number="newBook.price" type="number" step="0.01" class="form-control custom-input"
                    required>
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
                <input v-model.number="newBook.discountPercentage" type="number" min="0" max="100"
                  class="form-control custom-input">
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
    showNotification(message, type = 'success', duration = 2000) {
      const notification = document.createElement('div');
      const iconClass = type === 'success' ? 'bi-check-circle-fill' :
        type === 'error' ? 'bi-x-circle-fill' :
          'bi-info-circle-fill';
      const bgColor = type === 'success' ? 'rgba(76, 201, 240, 0.9)' :
        type === 'error' ? 'rgba(248, 113, 113, 0.9)' :
          'rgba(59, 130, 246, 0.9)';

      notification.className = 'cart-notification show';
      notification.style.background = bgColor;
      notification.innerHTML = `
        <div class="cart-notification-content">
          <i class="bi ${iconClass}"></i>
          <span>${message}</span>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, duration);
    },
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

        console.log(`Actualizando stock: ${book.id} -> ${book.stock}`)

      } catch (error) {
        console.error('Error al actualizar stock:', error)
      }
    },
    async updateBook(book) {
      try {
        const bookRef = doc(db, 'books', book.id)

        if (book.discountPercentage > 0) {
          book.discountedPrice = book.price * (1 - book.discountPercentage / 100)
        }

        const bookData = { ...book }
        delete bookData.id

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
        this.showNotification('Cerrando sesión', 'info', 2000)
        setTimeout(() => {
          this.router.push('/')
        }, 3000);
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
    },
    async saveBook() {
      try {

        if (this.newBook.price < 0 || this.newBook.stock < 0) {
          alert('El precio y el stock no pueden ser negativos')
          return
        }

        if (this.newBook.id) {

          await this.updateBook(this.newBook)
        } else {

          const newBookData = {
            ...this.newBook,
            createdAt: new Date().toISOString()
          }
          const booksCollection = collection(db, 'books')
          await addDoc(booksCollection, newBookData)
          console.log('Nuevo libro creado exitosamente')
        }


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
        delete eventData.id

        if (this.newEvent.id) {

          const eventRef = doc(db, 'events', this.newEvent.id)
          await updateDoc(eventRef, eventData)
          console.log('Evento actualizado exitosamente')
        } else {

          const eventsCollection = collection(db, 'events')
          await addDoc(eventsCollection, eventData)
          console.log('Nuevo evento creado exitosamente')
        }


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

<style scoped src="../assets/estilosCss/admin-panel.css"></style>
