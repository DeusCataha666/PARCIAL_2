<template>
  <div class="products-view d-flex">
    
    <div class="main-content flex-grow-1">
      <NavbarComponent />
      
      <div class="products-container container py-4">
        
        <div v-if="loading" class="loading-container text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-white fs-4">Cargando libros...</p>
        </div>

        
        <div v-if="error && !loading" class="alert alert-danger text-center">
          {{ error }}
        </div>

        
        <section v-if="!loading && !error && availableBooks.length > 0" class="mb-5">
          <h2 class="section-title">Libros Disponibles</h2>
          
          <div class="books-carousel d-md-none">
            <div class="books-scroll-container">
              <div v-for="book in availableBooks" :key="book.id" class="book-card-item">
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
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <p class="card-text card-description">{{ book.description }}</p>
                  <div class="mt-auto">
                    <p v-if="!book.discountPercentage" class="card-text fw-bold mb-2">${{ book.price }}</p>
                    <div v-else class="price-container mb-2">
                      <span class="original-price">${{ book.price }}</span>
                      <span class="discounted-price">${{ book.discountedPrice }}</span>
                    </div>
                    <div class="d-flex gap-2">
                      <button class="btn btn-outline-info flex-grow-1" @click="showBookDetails(book)">
                        <i class="bi bi-info-circle"></i> Detalles
                      </button>
                      <button class="btn btn-primary flex-grow-1" @click="addToCart(book)">
                        <i class="bi bi-cart-plus"></i> Añadir
                      </button>
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="row g-4 d-none d-md-flex">
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
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <p class="card-text card-description">{{ book.description }}</p>
                  <div class="mt-auto">
                    <p v-if="!book.discountPercentage" class="card-text fw-bold mb-2">${{ book.price }}</p>
                    <div v-else class="price-container mb-2">
                      <span class="original-price">${{ book.price }}</span>
                      <span class="discounted-price">${{ book.discountedPrice }}</span>
                    </div>
                    <div class="d-flex gap-2">
                      <button class="btn btn-outline-info flex-grow-1" @click="showBookDetails(book)">
                        <i class="bi bi-info-circle"></i> Detalles
                      </button>
                      <button class="btn btn-primary flex-grow-1" @click="addToCart(book)">
                        <i class="bi bi-cart-plus"></i> Añadir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section v-if="!loading && !error && upcomingBooks.length > 0" class="mb-5">
          <h2 class="section-title">Próximamente</h2>
          
          <div class="books-carousel d-md-none">
            <div class="books-scroll-container">
              <div v-for="book in upcomingBooks" :key="book.id" class="book-card-item">
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
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{{ book.title }}</h5>
                    <p class="card-text">{{ book.author }}</p>
                    <p class="card-text card-description">{{ book.description }}</p>
                    <div class="mt-auto">
                      <p class="card-text mb-2">
                        <small class="text-muted">Disponible: {{ formatDate(book.releaseDate) }}</small>
                      </p>
                      <div class="d-flex gap-2">
                        <button class="btn btn-outline-info flex-grow-1" @click="showBookDetails(book)">
                          <i class="bi bi-info-circle"></i> Detalles
                        </button>
                        <button class="btn btn-primary notify-btn flex-grow-1" @click="notifyMe(book)">
                          <i class="bi bi-bell"></i> Notificame
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-4 d-none d-md-flex">
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
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <p class="card-text card-description">{{ book.description }}</p>
                  <div class="mt-auto">
                    <p class="card-text mb-2">
                      <small class="text-muted">Disponible: {{ formatDate(book.releaseDate) }}</small>
                    </p>
                    <div class="d-flex gap-2">
                      <button class="btn btn-outline-info detail-btn flex-grow-1" @click="showBookDetails(book)">
                        <i class="bi bi-info-circle"></i> Detalles
                      </button>
                        <button class="btn btn-primary notify-btn flex-grow-1" @click="notifyMe(book)">
                          <i class="bi bi-bell"></i> Notificame
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <section v-if="!loading && !error && discountedBooks.length > 0" class="mb-5">
          <h2 class="section-title">Ofertas Especiales</h2>
          
          <div class="books-carousel d-md-none">
            <div class="books-scroll-container">
              <div v-for="book in discountedBooks" :key="book.id" class="book-card-item">
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
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{{ book.title }}</h5>
                    <p class="card-text">{{ book.author }}</p>
                    <p class="card-text card-description">{{ book.description }}</p>
                    <div class="mt-auto">
                      <div class="price-container mb-2">
                        <span class="original-price">${{ book.price }}</span>
                        <span class="discounted-price">${{ book.discountedPrice }}</span>
                      </div>
                      <div class="d-flex gap-2">
                        <button class="btn btn-outline-info flex-grow-1" @click="showBookDetails(book)">
                          <i class="bi bi-info-circle"></i> Detalles
                        </button>
                        <button class="btn btn-primary flex-grow-1" @click="addToCart(book)">
                          <i class="bi bi-cart-plus"></i> Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row g-4 d-none d-md-flex">
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
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">{{ book.title }}</h5>
                  <p class="card-text">{{ book.author }}</p>
                  <p class="card-text card-description">{{ book.description }}</p>
                  <div class="mt-auto">
                    <div class="price-container mb-2">
                      <span class="original-price">${{ book.price }}</span>
                      <span class="discounted-price">${{ book.discountedPrice }}</span>
                    </div>
                    <div class="d-flex gap-2">
                      <button class="btn btn-outline-info flex-grow-1" @click="showBookDetails(book)">
                        <i class="bi bi-info-circle"></i> Detalles
                      </button>
                      <button class="btn btn-primary flex-grow-1" @click="addToCart(book)">
                        <i class="bi bi-cart-plus"></i> Añadir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <div v-if="!loading && !error && books.length === 0" class="text-center py-5">
          <p class="no-events-message">No hay libros disponibles en este momento.</p>
        </div>

        
        <section v-if="!loading && !error" class="mb-3">
          <h2 class="section-title">Eventos Importantes</h2>
          
          <div class="books-carousel d-md-none">
            <div class="books-scroll-container">
              <div v-for="event in events" :key="event.id" class="book-card-item carousel-item-event">
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
                  <div class="event-body d-flex flex-column">
                    <h5 class="event-title">{{ event.title }}</h5>
                    <p class="event-description">{{ event.description }}</p>
                    <div class="mt-auto">
                      <div class="event-meta">
                        <span class="event-location">
                          <i class="bi bi-geo-alt"></i> {{ event.location }}
                        </span>
                        <span class="event-time">
                          <i class="bi bi-clock"></i> {{ event.time }}
                        </span>
                      </div>
                      <button class="btn btn-outline-info w-100 mt-2" @click="showEventDetails(event)">
                        <i class="bi bi-info-circle"></i> Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row d-none d-md-flex">
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
                <div class="event-body d-flex flex-column">
                  <h5 class="event-title">{{ event.title }}</h5>
                  <p class="event-description">{{ event.description }}</p>
                  <div class="mt-auto">
                    <div class="event-meta">
                      <span class="event-location">
                        <i class="bi bi-geo-alt"></i> {{ event.location }}
                      </span>
                      <span class="event-time">
                        <i class="bi bi-clock"></i> {{ event.time }}
                      </span>
                    </div>
                    <button class="btn btn-outline-info w-100 mt-2" @click="showEventDetails(event)">
                      <i class="bi bi-info-circle"></i> Ver Detalles
                    </button>
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

    
    <div class="book-modal-overlay" :class="{ show: showDetailsModal }" @click.self="closeDetailsModal">
      <div class="details-modal-content">
        <button class="book-modal-close" @click="closeDetailsModal">
          <i class="bi bi-x-lg"></i>
        </button>
        
        <div v-if="selectedBook" class="details-modal-body">
          <div class="details-image-section">
            <img 
              :src="selectedBook.imageUrl && selectedBook.imageUrl.trim() !== '' ? selectedBook.imageUrl : getPlaceholderImage()" 
              :alt="selectedBook.title"
              @error="handleImageError($event)"
            >
          </div>
          <div class="details-info-section">
            <h2>{{ selectedBook.title }}</h2>
            <p class="details-author"><i class="bi bi-person"></i> {{ selectedBook.author }}</p>
            <div class="details-description">
              <h4>Descripción</h4>
              <p>{{ selectedBook.description || 'No hay descripción disponible.' }}</p>
            </div>
            <div class="details-meta">
              <div v-if="selectedBook.category" class="meta-item">
                <i class="bi bi-tag"></i>
                <span>{{ selectedBook.category }}</span>
              </div>
              <div v-if="selectedBook.isbn" class="meta-item">
                <i class="bi bi-upc"></i>
                <span>ISBN: {{ selectedBook.isbn }}</span>
              </div>
              <div v-if="selectedBook.pages" class="meta-item">
                <i class="bi bi-file-text"></i>
                <span>{{ selectedBook.pages }} páginas</span>
              </div>
              <div v-if="selectedBook.stock !== undefined" class="meta-item">
                <i class="bi bi-box"></i>
                <span>Stock: {{ selectedBook.stock }}</span>
              </div>
            </div>
            <div class="details-price-section">
              <div v-if="selectedBook.discountPercentage && selectedBook.discountPercentage > 0" class="price-container">
                <span class="original-price">${{ selectedBook.price }}</span>
                <span class="discounted-price">${{ selectedBook.discountedPrice }}</span>
                <span class="discount-badge-inline">-{{ selectedBook.discountPercentage }}%</span>
              </div>
              <p v-else class="details-price">${{ selectedBook.price }}</p>
            </div>
            <div v-if="selectedBook.status === 'upcoming'" class="details-release">
              <p><i class="bi bi-calendar-event"></i> Disponible: {{ formatDate(selectedBook.releaseDate) }}</p>
            </div>
            <div class="details-actions">
              <button 
                v-if="selectedBook.status === 'available' && selectedBook.stock > 0" 
                class="btn btn-primary" 
                @click="addToCart(selectedBook); closeDetailsModal()"
              >
                <i class="bi bi-cart-plus"></i> Añadir al Carrito
              </button>
              <button 
                v-else-if="selectedBook.status === 'upcoming'" 
                class="btn btn-primary notify-btn" 
                @click="notifyMe(selectedBook)"
              >
                <i class="bi bi-bell"></i> Notificame cuando esté disponible
              </button>
              <button 
                class="btn btn-outline-danger" 
                @click="toggleFavorite(selectedBook)"
                :class="{ active: isFavorite(selectedBook.id) }"
              >
                <i :class="isFavorite(selectedBook.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                {{ isFavorite(selectedBook.id) ? 'Quitar de Favoritos' : 'Agregar a Favoritos' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="selectedEvent" class="details-modal-body">
          <div class="details-image-section">
            <img 
              :src="selectedEvent.imageUrl && selectedEvent.imageUrl.trim() !== '' ? selectedEvent.imageUrl : getPlaceholderImage()" 
              :alt="selectedEvent.title"
              @error="handleImageError($event)"
            >
            <div class="event-date-badge-large">
              <div class="event-day">{{ formatEventDay(selectedEvent.date) }}</div>
              <div class="event-month">{{ formatEventMonth(selectedEvent.date) }}</div>
            </div>
          </div>
          <div class="details-info-section">
            <h2>{{ selectedEvent.title }}</h2>
            <div class="details-description">
              <h4>Descripción</h4>
              <p>{{ selectedEvent.description || 'No hay descripción disponible.' }}</p>
            </div>
            <div class="details-meta">
              <div class="meta-item">
                <i class="bi bi-geo-alt"></i>
                <span>{{ selectedEvent.location }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-clock"></i>
                <span>{{ selectedEvent.time }}</span>
              </div>
              <div v-if="selectedEvent.date" class="meta-item">
                <i class="bi bi-calendar"></i>
                <span>{{ formatDate(selectedEvent.date) }}</span>
              </div>
            </div>
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
      showCartModal: false,
      showDetailsModal: false,
      selectedBook: null,
      selectedEvent: null
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
    this.requestNotificationPermission();
    
    
    this.handleShowCartModal = () => {
      this.showCartModal = true;
    };
    
    
    window.addEventListener('show-cart-modal', this.handleShowCartModal);
    
    
    this.notificationCheckInterval = setInterval(() => {
      this.checkPendingNotifications();
    }, 60000);
  },
  beforeUnmount() {
    
    if (this.handleShowCartModal) {
      window.removeEventListener('show-cart-modal', this.handleShowCartModal);
    }
    if (this.notificationCheckInterval) {
      clearInterval(this.notificationCheckInterval);
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
          
          
          if (bookData.releaseDate && bookData.releaseDate.toDate) {
            bookData.releaseDate = bookData.releaseDate.toDate();
          } else if (bookData.releaseDate && typeof bookData.releaseDate === 'string') {
            bookData.releaseDate = new Date(bookData.releaseDate);
          }
          
          
          if (bookData.discountPercentage && bookData.discountPercentage > 0) {
            bookData.discountedPrice = parseFloat(
              (bookData.price * (1 - bookData.discountPercentage / 100)).toFixed(2)
            );
          } else {
            bookData.discountedPrice = bookData.price;
          }
          
          
          if (!bookData.discountPercentage) {
            bookData.discountPercentage = 0;
          }
          
          
          if (bookData.stock === undefined || bookData.stock === null) {
            bookData.stock = 0;
          }
          
          
          
          if (!bookData.imageUrl || bookData.imageUrl.trim() === '') {
            bookData.imageUrl = null;
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
        
        const dateObj = date instanceof Date ? date : new Date(date);
        
        
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
      if (this.cart.length === 0) {
        this.showNotification('Tu carrito está vacío', 'error');
        return;
      }
      this.closeCartModal();
      this.$router.push('/checkout');
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
    checkPendingNotifications() {
      try {
        const notifications = JSON.parse(localStorage.getItem('bookNotifications') || '[]');
        const pendingNotifications = notifications.filter(n => !n.notified);
        
        pendingNotifications.forEach(notif => {
          const book = this.books.find(b => b.id === notif.bookId);
          if (book && book.status === 'available' && book.stock > 0) {
            this.sendBookAvailableNotification(book);
          }
        });
      } catch (error) {
        console.error('Error al verificar notificaciones:', error);
      }
    },
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
    getPlaceholderImage() {
      
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE3MmE0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODkyYjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
    },
    handleImageError(event) {
      
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
      try {
        
        const existingNotifications = JSON.parse(localStorage.getItem('bookNotifications') || '[]');
        
        
        const alreadyNotified = existingNotifications.some(notif => notif.bookId === book.id);
        
        if (alreadyNotified) {
          this.showNotification('Ya estás registrado para recibir notificaciones sobre este libro', 'info');
          return;
        }
        
        
        const newNotification = {
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.author,
          releaseDate: book.releaseDate ? (book.releaseDate instanceof Date ? book.releaseDate.toISOString() : book.releaseDate) : null,
          notified: false,
          createdAt: new Date().toISOString()
        };
        
        existingNotifications.push(newNotification);
        localStorage.setItem('bookNotifications', JSON.stringify(existingNotifications));
        
        this.showNotification(`Te notificaremos cuando "${book.title}" esté disponible`, 'success');
        
        
        this.checkBookAvailability(book);
      } catch (error) {
        console.error('Error al registrar notificación:', error);
        this.showNotification('Error al registrar la notificación', 'error');
      }
    },
    checkBookAvailability(book) {
      
      const checkInterval = setInterval(() => {
        const currentBook = this.books.find(b => b.id === book.id);
        if (currentBook && currentBook.status === 'available' && currentBook.stock > 0) {
          
          this.sendBookAvailableNotification(book);
          clearInterval(checkInterval);
        }
      }, 30000);
      
      
      setTimeout(() => clearInterval(checkInterval), 24 * 60 * 60 * 1000);
    },
    sendBookAvailableNotification(book) {
      try {
        const notifications = JSON.parse(localStorage.getItem('bookNotifications') || '[]');
        const notification = notifications.find(n => n.bookId === book.id && !n.notified);
        
        if (notification) {
          notification.notified = true;
          notification.notifiedAt = new Date().toISOString();
          localStorage.setItem('bookNotifications', JSON.stringify(notifications));
          
          
          this.showNotification(`¡"${book.title}" ya está disponible!`, 'success', 5000);
          
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`¡Libro Disponible!`, {
              body: `${book.title} por ${book.author} ya está disponible para compra`,
              icon: book.imageUrl || '/favicon.ico'
            });
          }
        }
      } catch (error) {
        console.error('Error al enviar notificación:', error);
      }
    },
    requestNotificationPermission() {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    },
    showBookDetails(book) {
      this.selectedBook = book;
      this.selectedEvent = null;
      this.showDetailsModal = true;
    },
    showEventDetails(event) {
      this.selectedEvent = event;
      this.selectedBook = null;
      this.showDetailsModal = true;
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedBook = null;
      this.selectedEvent = null;
    }
  }
};
</script>

<style scoped src="../assets/estilosCss/products-view.css"></style>
