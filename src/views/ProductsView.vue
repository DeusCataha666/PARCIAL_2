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
          <!-- Carrusel para pantallas pequeñas -->
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
          <!-- Grid para pantallas grandes -->
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

        <!-- Sección de próximos lanzamientos -->
        <section v-if="!loading && !error && upcomingBooks.length > 0" class="mb-5">
          <h2 class="section-title">Próximamente</h2>
          <!-- Carrusel para pantallas pequeñas (Próximamente) -->
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

        <!-- Sección de ofertas -->
        <section v-if="!loading && !error && discountedBooks.length > 0" class="mb-5">
          <h2 class="section-title">Ofertas Especiales</h2>
          <!-- Carrusel para pantallas pequeñas (Ofertas Especiales) -->
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

        <!-- Mensaje cuando no hay libros -->
        <div v-if="!loading && !error && books.length === 0" class="text-center py-5">
          <p class="no-events-message">No hay libros disponibles en este momento.</p>
        </div>

        <!-- Sección de Eventos Importantes -->
        <section v-if="!loading && !error" class="mb-5">
          <h2 class="section-title">Eventos Importantes</h2>
          <!-- Carrusel para pantallas pequeñas (Eventos Importantes) -->
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

          <div class="row g-4 d-none d-md-flex">
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

    <!-- Modal de Detalles de Libro -->
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
    
    // Guardar referencia a la función para poder removerla después
    this.handleShowCartModal = () => {
      this.showCartModal = true;
    };
    
    // Escuchar evento para mostrar el carrito desde el navbar
    window.addEventListener('show-cart-modal', this.handleShowCartModal);
    
    // Verificar notificaciones pendientes cada minuto
    this.notificationCheckInterval = setInterval(() => {
      this.checkPendingNotifications();
    }, 60000);
  },
  beforeUnmount() {
    // Limpiar el listener cuando el componente se destruya
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
      // Crear notificación temporal
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
      try {
        // Obtener notificaciones existentes
        const existingNotifications = JSON.parse(localStorage.getItem('bookNotifications') || '[]');
        
        // Verificar si ya está registrado
        const alreadyNotified = existingNotifications.some(notif => notif.bookId === book.id);
        
        if (alreadyNotified) {
          this.showNotification('Ya estás registrado para recibir notificaciones sobre este libro', 'info');
          return;
        }
        
        // Agregar nueva notificación
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
        
        // Verificar periódicamente si el libro está disponible
        this.checkBookAvailability(book);
      } catch (error) {
        console.error('Error al registrar notificación:', error);
        this.showNotification('Error al registrar la notificación', 'error');
      }
    },
    checkBookAvailability(book) {
      // Verificar cada 30 segundos si el libro cambió de estado
      const checkInterval = setInterval(() => {
        const currentBook = this.books.find(b => b.id === book.id);
        if (currentBook && currentBook.status === 'available' && currentBook.stock > 0) {
          // El libro está disponible, notificar
          this.sendBookAvailableNotification(book);
          clearInterval(checkInterval);
        }
      }, 30000);
      
      // Limpiar después de 24 horas
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
          
          // Mostrar notificación visual
          this.showNotification(`¡"${book.title}" ya está disponible!`, 'success', 5000);
          
          // Opcional: usar la API de notificaciones del navegador
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
  background: #f8717181;
  border: 2px solid var(--error-color);
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

.favorite-btn i {
  pointer-events: none;
  color: var(--error-color);
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

/* Estilos para cards con altura uniforme */
.card-body {
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.card-description {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  min-height: 60px;
}

/* Carrusel horizontal para pantallas pequeñas */
.books-carousel {
  margin: 0 -1rem;
  padding: 0 1rem;
}

.books-scroll-container {
  display: flex;
  /* Habilitar scroll snap para una experiencia tipo carrusel */
  scroll-snap-type: x mandatory;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-color) rgba(255, 255, 255, 0.1);
}

.books-scroll-container::-webkit-scrollbar {
  height: 8px;
}

.books-scroll-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.books-scroll-container::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

.books-scroll-container::-webkit-scrollbar-thumb:hover {
  background: var(--hover-btn);
}

.book-card-item {
  flex: 0 0 280px;
  min-width: 280px;
  scroll-snap-align: start;
}

/* En carrusel mobile hacemos el botón más compacto y con ancho adecuado */
.books-carousel {
  min-width: 160px;
  padding: 0.6rem 0.9rem;
}

@media (max-width: 480px) {
  .books-carousel {
    min-width: 140px;
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  .books-carousel i {
    font-size: 1rem;
  }

  .notify-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

/* Variante para items de eventos (tamaño ligeramente mayor) */
.carousel-item-event {
  flex: 0 0 320px;
  min-width: 320px;
  scroll-snap-align: start;
}

/* Modal de detalles */
.details-modal-content {
  background: var(--glass-effect);
  border: 2px solid var(--glass-border);
  border-radius: 20px;
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
}

.details-modal-body {
  display: flex;
  gap: 2rem;
  padding: 2rem;
}

.details-image-section {
  flex: 0 0 300px;
  position: relative;
}

.details-image-section img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.details-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.details-info-section h2 {
  color: var(--text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  font-family: 'Orbitron', sans-serif;
}

.details-author {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.details-description h4 {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.details-description p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.details-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--glass-border);
}

.meta-item i {
  color: var(--accent-color);
}

.details-price-section {
  padding: 1rem;
  background: rgba(76, 201, 240, 0.1);
  border-radius: 12px;
  border: 1px solid var(--accent-color);
}

.details-price {
  color: var(--accent-color);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.discount-badge-inline {
  background: linear-gradient(135deg, var(--accent-secondary), #8b2fc9);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-left: 1rem;
}

.details-release {
  color: var(--text-secondary);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.details-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.details-actions .btn {
  flex: 1;
  min-width: 150px;
}

.event-date-badge-large {
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, var(--accent-color), var(--hover-btn));
  color: var(--primary-bg);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  min-width: 70px;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.4);
}

.event-date-badge-large .event-day {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.event-date-badge-large .event-month {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.3rem;
}



@media (max-width: 768px) {
  .products-container {
    padding: 1rem 0.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }

  .details-modal-body {
    flex-direction: column;
    padding: 1.5rem;
  }

  .details-image-section {
    flex: 0 0 auto;
  }

  .details-actions {
    flex-direction: column;
  }

  .details-actions .btn {
    width: 100%;
  }
}

@media (max-width: 1180px) {
  .notify-btn, .detail-btn{
    font-size: 0.95rem;
  }

  
}
</style>
