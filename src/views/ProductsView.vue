<template>
  <div class="products-view d-flex">
    <!-- Contenido principal -->
    <div class="main-content flex-grow-1">
      <NavbarComponent />
      
      <div class="products-container container py-4">
        <!-- Estado de carga -->
        <div v-if="loading" class="loading-container text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-muted">Cargando libros...</p>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error && !loading" class="alert alert-danger text-center">
          {{ error }}
        </div>

        <!-- Sección de libros disponibles -->
        <section v-if="!loading && !error && availableBooks.length > 0" class="mb-5">
          <h2 class="section-title">Libros Disponibles</h2>
          <div class="row g-4">
            <div v-for="book in availableBooks" :key="book.id" class="col-md-4">
              <div class="card h-100">
                <div class="card-image-wrapper">
                  <img 
                    :src="book.imageUrl && book.imageUrl.trim() !== '' ? book.imageUrl : getPlaceholderImage()" 
                    class="card-img-top" 
                    :alt="book.title"
                    @error="handleImageError($event)"
                  >
                  <button 
                    class="favorite-btn" 
                    @click="toggleFavorite(book)"
                    :class="{ active: isFavorite(book.id) }"
                    :title="isFavorite(book.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
                  >
                    <i :class="isFavorite(book.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                  </button>
                </div>
                <div class="card-body">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <p class="card-text">{{ book.description }}</p>
                  <p v-if="!book.discountPercentage" class="card-text fw-bold">${{ book.price }}</p>
                  <div v-else class="price-container">
                    <span class="original-price">${{ book.price }}</span>
                    <span class="discounted-price">${{ book.discountedPrice }}</span>
                  </div>
                  <button class="btn btn-primary w-100" @click="addToCart(book)">
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Sección de próximos lanzamientos -->
        <section v-if="!loading && !error && upcomingBooks.length > 0" class="mb-5">
          <h2 class="section-title">Próximamente</h2>
          <div class="row g-4">
            <div v-for="book in upcomingBooks" :key="book.id" class="col-md-4">
              <div class="card h-100">
                <div class="card-image-wrapper">
                  <img 
                    :src="book.imageUrl && book.imageUrl.trim() !== '' ? book.imageUrl : getPlaceholderImage()" 
                    class="card-img-top" 
                    :alt="book.title"
                    @error="handleImageError($event)"
                  >
                  <button 
                    class="favorite-btn" 
                    @click="toggleFavorite(book)"
                    :class="{ active: isFavorite(book.id) }"
                    :title="isFavorite(book.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
                  >
                    <i :class="isFavorite(book.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                  </button>
                  <div class="coming-soon-badge">Próximamente</div>
                </div>
                <div class="card-body">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <p class="card-text">{{ book.description }}</p>
                  <p class="card-text">
                    <small class="text-muted">Disponible: {{ formatDate(book.releaseDate) }}</small>
                  </p>
                  <button class="btn btn-outline-primary w-100" @click="notifyMe(book)">
                    Notificarme
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Sección de ofertas -->
        <section v-if="!loading && !error && discountedBooks.length > 0" class="mb-5">
          <h2 class="section-title">Ofertas Especiales</h2>
          <div class="row g-4">
            <div v-for="book in discountedBooks" :key="book.id" class="col-md-4">
              <div class="card h-100">
                <div class="card-image-wrapper">
                  <img 
                    :src="book.imageUrl && book.imageUrl.trim() !== '' ? book.imageUrl : getPlaceholderImage()" 
                    class="card-img-top" 
                    :alt="book.title"
                    @error="handleImageError($event)"
                  >
                  <button 
                    class="favorite-btn" 
                    @click="toggleFavorite(book)"
                    :class="{ active: isFavorite(book.id) }"
                    :title="isFavorite(book.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'"
                  >
                    <i :class="isFavorite(book.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                  </button>
                  <div class="discount-badge">-{{ book.discountPercentage }}%</div>
                </div>
                <div class="card-body">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <p class="card-text">{{ book.description }}</p>
                  <div class="price-container">
                    <span class="original-price">${{ book.price }}</span>
                    <span class="discounted-price">${{ book.discountedPrice }}</span>
                  </div>
                  <button class="btn btn-primary w-100" @click="addToCart(book)">
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Mensaje cuando no hay libros -->
        <div v-if="!loading && !error && books.length === 0" class="text-center py-5">
          <p class="no-events-message">No hay libros disponibles en este momento.</p>
        </div>

        <!-- Sección de Eventos Importantes -->
        <section v-if="!loading && !error" class="mb-5">
          <h2 class="section-title">Eventos Importantes</h2>
          <div class="row g-4">
            <div v-for="event in events" :key="event.id" class="col-md-4">
              <div class="event-card">
                <div class="event-image-wrapper">
                  <img 
                    :src="event.imageUrl && event.imageUrl.trim() !== '' ? event.imageUrl : getPlaceholderImage()" 
                    class="event-image" 
                    :alt="event.title"
                    @error="handleImageError($event)"
                  >
                  <div class="event-date-badge">
                    <div class="event-day">{{ formatEventDay(event.date) }}</div>
                    <div class="event-month">{{ formatEventMonth(event.date) }}</div>
                  </div>
                </div>
                <div class="event-body">
                  <h5 class="event-title">{{ event.title }}</h5>
                  <p class="event-description">{{ event.description }}</p>
                  <div class="event-meta">
                    <span class="event-location">
                      <i class="bi bi-geo-alt"></i> {{ event.location }}
                    </span>
                    <span class="event-time">
                      <i class="bi bi-clock"></i> {{ event.time }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="events.length === 0" class="text-center py-4">
            <p class="no-events-message" style="color: white;">No hay eventos programados en este momento.</p>
          </div>
        </section>
      </div>
      
      <FooterComponent />
    </div>

    <!-- Modal de Carrito -->
    <div class="book-modal-overlay" :class="{ show: showCartModal }" @click.self="closeCartModal">
      <div class="cart-modal-content">
        <button class="book-modal-close" @click="closeCartModal">
          <i class="bi bi-x-lg"></i>
        </button>
        
        <div class="cart-modal-header">
          <h2>
            <i class="bi bi-cart-fill"></i>
            Mi Carrito
          </h2>
        </div>

        <div class="cart-modal-body">
          <div v-if="cart.length === 0" class="cart-empty">
            <i class="bi bi-cart-x"></i>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega algunos libros para comenzar</p>
          </div>

          <div v-else class="cart-items-container">
            <div v-for="(item, index) in cart" :key="item.id || index" class="cart-item">
              <div class="cart-item-image">
                <img 
                  :src="item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : getPlaceholderImage()" 
                  :alt="item.title"
                  @error="handleImageError($event)"
                >
              </div>
              <div class="cart-item-info">
                <h4 class="cart-item-title">{{ item.title }}</h4>
                <p class="cart-item-author">{{ item.author }}</p>
                <p class="cart-item-description">{{ item.description }}</p>
                <p class="cart-item-price">${{ item.discountedPrice || item.price }}</p>
              </div>
              <div class="cart-item-controls">
                <div class="quantity-controls">
                  <button class="quantity-btn" @click="decreaseQuantity(item)">
                    <i class="bi bi-dash"></i>
                  </button>
                  <span class="quantity-display">{{ item.quantity || 1 }}</span>
                  <button class="quantity-btn" @click="increaseQuantity(item)">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                <button class="remove-item-btn" @click="removeFromCart(item.id)" title="Eliminar">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cart.length > 0" class="cart-modal-footer">
          <div class="cart-total">
            <span class="cart-total-label">Total:</span>
            <span class="cart-total-amount">${{ cartTotal.toFixed(2) }}</span>
          </div>
          <div class="cart-actions">
            <button class="btn secondary-btn" @click="clearCart">
              <i class="bi bi-trash"></i> Vaciar Carrito
            </button>
            <button class="btn primary-btn" @click="checkout">
              <i class="bi bi-credit-card"></i> Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarComponent from "../components/NavbarComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default {
  name: "ProductsView",
  components: {
    NavbarComponent,
    FooterComponent,
  },
  data() {
    return {
      books: [],
      cart: [],
      favorites: [],
      notifications: [],
      events: [],
      loading: true,
      error: null,
      showCartModal: false
    };
  },
  computed: {
    availableBooks() {
      return this.books.filter(book => 
        book.status === 'available' && 
        book.stock > 0 && 
        book.discountPercentage === 0
      );
    },
    upcomingBooks() {
      return this.books.filter(book => book.status === 'upcoming');
    },
    discountedBooks() {
      return this.books.filter(book => 
        book.status === 'available' && 
        book.stock > 0 && 
        book.discountPercentage > 0
      );
    },
    cartTotal() {
      return this.cart.reduce((total, item) => {
        const price = item.discountedPrice || item.price;
        return total + (price * (item.quantity || 1));
      }, 0);
    }
  },
  created() {
    this.loadBooks();
    this.loadEvents();
    this.loadCart();
    this.loadFavorites();
    
    // Guardar referencia a la función para poder removerla después
    this.handleShowCartModal = () => {
      this.showCartModal = true;
    };
    
    // Escuchar evento para mostrar el carrito desde el navbar
    window.addEventListener('show-cart-modal', this.handleShowCartModal);
  },
  beforeUnmount() {
    // Limpiar el listener cuando el componente se destruya
    if (this.handleShowCartModal) {
      window.removeEventListener('show-cart-modal', this.handleShowCartModal);
    }
  },
  methods: {
    async loadEvents() {
      try {
        const eventsCollection = collection(db, 'events');
        const querySnapshot = await getDocs(eventsCollection);
        
        this.events = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const eventData = {
            id: doc.id,
            ...data
          };
          
          // Convertir Timestamp de Firestore a Date si es necesario
          if (eventData.date && eventData.date.toDate) {
            eventData.date = eventData.date.toDate();
          } else if (eventData.date && typeof eventData.date === 'string') {
            eventData.date = new Date(eventData.date);
          }
          
          return eventData;
        });
        
        console.log('Eventos cargados desde Firestore:', this.events.length);
      } catch (error) {
        console.error('Error al cargar eventos desde Firestore:', error);
      }
    },
    async loadBooks() {
      this.loading = true;
      this.error = null;
      
      try {
        const booksCollection = collection(db, 'books');
        const querySnapshot = await getDocs(booksCollection);
        
        this.books = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const bookData = {
            id: doc.id,
            ...data
          };
          
          // Convertir Timestamp de Firestore a Date si es necesario
          if (bookData.releaseDate && bookData.releaseDate.toDate) {
            bookData.releaseDate = bookData.releaseDate.toDate();
          } else if (bookData.releaseDate && typeof bookData.releaseDate === 'string') {
            bookData.releaseDate = new Date(bookData.releaseDate);
          }
          
          // Calcular precio con descuento si existe
          if (bookData.discountPercentage && bookData.discountPercentage > 0) {
            bookData.discountedPrice = parseFloat(
              (bookData.price * (1 - bookData.discountPercentage / 100)).toFixed(2)
            );
          } else {
            bookData.discountedPrice = bookData.price;
          }
          
          // Asegurar que discountPercentage tenga un valor por defecto
          if (!bookData.discountPercentage) {
            bookData.discountPercentage = 0;
          }
          
          // Asegurar que stock tenga un valor por defecto
          if (bookData.stock === undefined || bookData.stock === null) {
            bookData.stock = 0;
          }
          
          // Asegurar que imageUrl se preserve si existe (puede ser string vacío, null o undefined)
          // Si no existe o está vacío, se manejará en el template con getPlaceholderImage()
          if (!bookData.imageUrl || bookData.imageUrl.trim() === '') {
            bookData.imageUrl = null; // Marcar como null para que el template use el placeholder
          }
          
          console.log('Libro cargado:', {
            id: bookData.id,
            title: bookData.title,
            imageUrl: bookData.imageUrl
          });
          
          return bookData;
        });
        
        console.log('Libros cargados desde Firestore:', this.books.length);
      } catch (error) {
        console.error('Error al cargar los libros desde Firestore:', error);
        this.error = 'Error al cargar los libros. Por favor, intenta de nuevo más tarde.';
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return '';
      
      try {
        // Si es un objeto Date, usarlo directamente
        const dateObj = date instanceof Date ? date : new Date(date);
        
        // Verificar que la fecha sea válida
        if (isNaN(dateObj.getTime())) {
          return 'Fecha no disponible';
        }
        
        return dateObj.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return 'Fecha no disponible';
      }
    },
    loadCart() {
      try {
        const savedCart = localStorage.getItem('cart');
        this.cart = savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error('Error al cargar el carrito:', error);
        this.cart = [];
      }
    },
    saveCart() {
      try {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        // Disparar evento para actualizar contadores en navbar
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error al guardar el carrito:', error);
      }
    },
    addToCart(book) {
      const existingItem = this.cart.find(item => item.id === book.id);
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        this.cart.push({
          ...book,
          quantity: 1
        });
      }
      
      this.saveCart();
      
      // Mostrar notificación sin abrir el modal
      this.showNotification(`"${book.title}" agregado al carrito`);
    },
    removeFromCart(bookId) {
      this.cart = this.cart.filter(item => item.id !== bookId);
      this.saveCart();
    },
    increaseQuantity(item) {
      item.quantity = (item.quantity || 1) + 1;
      this.saveCart();
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeFromCart(item.id);
      }
      this.saveCart();
    },
    clearCart() {
      if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        this.cart = [];
        this.saveCart();
      }
    },
    checkout() {
      alert('Funcionalidad de pago en desarrollo. Total: $' + this.cartTotal.toFixed(2));
    },
    closeCartModal() {
      this.showCartModal = false;
    },
    loadFavorites() {
      try {
        const savedFavorites = localStorage.getItem('favorites');
        this.favorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        this.favorites = [];
      }
    },
    saveFavorites() {
      try {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        // Disparar evento para actualizar contadores en navbar
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error al guardar favoritos:', error);
      }
    },
    isFavorite(bookId) {
      return this.favorites.some(fav => fav.id === bookId);
    },
    toggleFavorite(book) {
      const index = this.favorites.findIndex(fav => fav.id === book.id);
      
      if (index > -1) {
        this.favorites.splice(index, 1);
        this.showNotification(`"${book.title}" eliminado de favoritos`);
      } else {
        this.favorites.push({
          id: book.id,
          title: book.title,
          author: book.author,
          imageUrl: book.imageUrl,
          price: book.price,
          discountedPrice: book.discountedPrice
        });
        this.showNotification(`"${book.title}" agregado a favoritos`);
      }
      
      this.saveFavorites();
    },
    showNotification(message) {
      // Crear notificación temporal
      const notification = document.createElement('div');
      notification.className = 'cart-notification show';
      notification.innerHTML = `
        <div class="cart-notification-content">
          <i class="bi bi-check-circle-fill"></i>
          <span>${message}</span>
        </div>
      `;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
      }, 2000);
    },
    getPlaceholderImage() {
      // Retornar una imagen placeholder en base64 o una URL de placeholder service
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE3MmE0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODkyYjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
    },
    handleImageError(event) {
      // Si la imagen falla al cargar, usar el placeholder
      event.target.src = this.getPlaceholderImage();
    },
    formatEventDay(date) {
      if (!date) return '';
      try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.getDate();
      } catch (error) {
        return '';
      }
    },
    formatEventMonth(date) {
      if (!date) return '';
      try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toLocaleDateString('es-ES', { month: 'short' }).toUpperCase();
      } catch (error) {
        return '';
      }
    },
    notifyMe(book) {
      // Implementar sistema de notificaciones
      this.notifications.push({
        bookId: book.id,
        userId: 'currentUserId', // Obtener del estado de autenticación
        email: 'user@email.com' // Obtener del estado de autenticación
      });
      console.log('Te notificaremos cuando esté disponible:', book.title);
    }
  }
};
</script>

<style scoped>
.products-view {
  width: 100%;
  min-height: 100vh;
}

.main-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.products-container {
  flex: 1;
  width: 100%;
  padding: 2rem 1rem;
}

.section-title {
  font-family: "Orbitron", "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  background: linear-gradient(135deg, var(--text-primary), var(--accent-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  position: relative;
  text-align: center;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, var(--accent-color), var(--accent-secondary));
  border-radius: 2px;
}

.card {
  background: var(--glass-effect);
  border: 2px solid var(--glass-border);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: visible;
  position: relative;
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
  height: 350px;
  border-radius: 12px 12px 0 0;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(76, 201, 240, 0.3);
  border-color: var(--accent-color);
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: var(--glass-effect);
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.card-text {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.original-price {
  color: var(--text-secondary);
  text-decoration: line-through;
  font-size: 0.9rem;
}

.discounted-price {
  color: var(--accent-color);
  font-weight: 700;
  font-size: 1.2rem;
}

.coming-soon-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, var(--accent-color), var(--hover-btn));
  color: var(--primary-bg);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.4);
}

.discount-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, var(--accent-secondary), #8b2fc9);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 700;
  z-index: 20;
  box-shadow: 0 4px 15px rgba(114, 9, 183, 0.4);
}

/* Estilos para eventos */
.event-card {
  background: var(--glass-effect);
  border: 2px solid var(--glass-border);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(76, 201, 240, 0.3);
  border-color: var(--accent-color);
}

.event-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.event-card:hover .event-image {
  transform: scale(1.1);
}

.event-date-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, var(--accent-color), var(--hover-btn));
  color: var(--primary-bg);
  padding: 0.8rem;
  border-radius: 12px;
  text-align: center;
  min-width: 60px;
  z-index: 10;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.4);
}

.event-day {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.event-month {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.2rem;
}

.event-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.event-title {
  color: var(--text-primary);
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1.2rem;
}

.event-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
}

.event-location,
.event-time {
  color: var(--text-secondary);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.event-location i,
.event-time i {
  color: var(--accent-color);
}

.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), var(--hover-btn));
  color: var(--primary-bg);
  border: none;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--hover-btn), var(--accent-color));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 201, 240, 0.5);
  color: var(--primary-bg);
}

.btn-outline-primary {
  background: transparent;
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  backdrop-filter: blur(10px);
}

.btn-outline-primary:hover {
  background: rgba(76, 201, 240, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 201, 240, 0.3);
  color: var(--text-primary);
}

.loading-container {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-container .spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3rem;
  color: var(--accent-color);
}

.alert {
  background: var(--glass-effect);
  border: 2px solid var(--error-color);
  color: var(--text-primary);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
}

.favorite-btn {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid var(--glass-border);
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 20;
  backdrop-filter: blur(10px);
  color: var(--text-primary);
  font-size: 1.3rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.favorite-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
  border-color: var(--accent-color);
}

.favorite-btn.active {
  background: linear-gradient(135deg, #ff6b9d, #ff8fab);
  border-color: #ff6b9d;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
}

.favorite-btn.active:hover {
  background: linear-gradient(135deg, #ff8fab, #ff6b9d);
  box-shadow: 0 6px 20px rgba(255, 107, 157, 0.6);
}

.no-events-message {
  color: white;
  font-weight: 100;
  font-size: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  margin-left: 1rem;
  margin-right: 1rem;
}

@media (max-width: 768px) {
  .products-container {
    padding: 1rem 0.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
