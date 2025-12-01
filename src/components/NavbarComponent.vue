<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <div class="logo" >
          <span class="logo-part">NEXUS</span>
          <span class="logo-part">LIBRARY</span>
        </div>
        <button class="navbar-toggler btn btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div class="d-flex align-items-center p-5 gap-3">
            <template v-if="!isAuthenticated">
              <router-link to="/login" class="btn btn-light">
                <i class="bi bi-person-circle"></i> Iniciar Sesión
              </router-link>
            </template>

            <template v-else>
              <router-link v-if="isAdmin" to="/admin" class="btn btn-warning">
                <i class="bi bi-gear-fill"></i> Panel Admin
              </router-link>

              <button v-if="!isAdmin" class="btn btn-light" @click="showCart">
                <i class="bi bi-cart"></i> Carrito
                <span v-if="cartCount > 0" class="bagde rounded-circle bg-danger text-black">
                  {{ cartCount }}
                </span>
              </button>

              <!-- Botón de perfil (solo para usuarios no admin) -->
              <button v-if="!isAdmin" class="btn btn-light" @click="showProfile">
                <i class="bi bi-person-circle"></i> Mi Perfil
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <!-- Modal de Perfil -->
  <div class="profile-modal-overlay" :class="{ show: showProfileModal }" @click.self="closeProfileModal">
    <div class="profile-modal-content">
      <button class="profile-modal-close" @click="closeProfileModal">
        <i class="bi bi-x-lg"></i>
      </button>
      
      <div class="profile-modal-header">
        <div class="profile-avatar">
          <i class="bi bi-person-circle"></i>
        </div>
        <h2>{{ userData?.displayName || 'Usuario' }}</h2>
        <p>{{ userData?.email || '' }}</p>
      </div>

      <div class="profile-modal-body">
          <div class="profile-info-section">
          <h3><i class="bi bi-info-circle"></i> Información</h3>
          <div class="profile-info-item">
            <label>Email:</label>
            <span>{{ userData?.email || 'No disponible' }}</span>
          </div>
          <div class="profile-info-item">
            <label>Nombre:</label>
            <span>{{ userData?.displayName || 'No disponible' }}</span>
          </div>
        </div>

        <div class="profile-stats-section">
          <h3><i class="bi bi-bar-chart"></i> Estadísticas</h3>
          <div class="profile-stats-grid">
            <div class="stat-card clickable" @click="openFavoritesModal">
              <div class="stat-icon">
                <i class="bi bi-heart-fill"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ favoritesCount }}</div>
                <div class="stat-label">Favoritos</div>
              </div>
            </div>
            <div class="stat-card clickable" @click="showCartModal">
              <div class="stat-icon">
                <i class="bi bi-cart-fill"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ cartCount }}</div>
                <div class="stat-label">En Carrito</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-modal-footer">
        <button class="btn secondary-btn" @click="closeProfileModal">
          <i class="bi bi-x-circle"></i> Cerrar
        </button>
        <button class="btn danger-btn" @click="logout">
          <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de Favoritos -->
  <div class="profile-modal-overlay centered-overlay" :class="{ show: showFavoritesModal }" @click.self="closeFavoritesModal">
    <div class="profile-modal-content favorites-modal">
      <button class="profile-modal-close" @click="closeFavoritesModal">
        <i class="bi bi-x-lg"></i>
      </button>
      
      <div class="profile-modal-header">
        <h2><i class="bi bi-heart-fill"></i> Mis Favoritos</h2>
      </div>

      <div class="profile-modal-body">
        <div v-if="favoritesList.length === 0" class="empty-state">
          <i class="bi bi-heart"></i>
          <h3>No tienes favoritos aún</h3>
          <p>Agrega libros a tus favoritos para verlos aquí</p>
        </div>

        <div v-else class="favorites-list">
          <div v-for="(item, index) in favoritesList" :key="item.id || index" class="favorite-item">
            <div class="favorite-item-image">
              <img 
                :src="item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : getPlaceholderImage()" 
                :alt="item.title"
                @error="handleImageError($event)"
              >
            </div>
            <div class="favorite-item-info">
              <h4>{{ item.title }}</h4>
              <p>{{ item.author }}</p>
              <p class="favorite-item-price">${{ item.discountedPrice || item.price }}</p>
            </div>
            <button class="remove-favorite-btn" @click="removeFavorite(item.id)" title="Quitar de favoritos">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Carrito -->
  <div class="profile-modal-overlay centered-overlay" :class="{ show: showCartModalFromProfile }" @click.self="closeCartModalFromProfile">
    <div class="profile-modal-content cart-modal">
      <button class="profile-modal-close" @click="closeCartModalFromProfile">
        <i class="bi bi-x-lg"></i>
      </button>
      
      <div class="profile-modal-header">
        <h2><i class="bi bi-cart-fill"></i> Mi Carrito</h2>
      </div>

      <div class="profile-modal-body">
        <div v-if="cartList.length === 0" class="empty-state">
          <i class="bi bi-cart-x"></i>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega algunos libros para comenzar</p>
        </div>

        <div v-else class="cart-items-list">
          <div v-for="(item, index) in cartList" :key="item.id || index" class="cart-item-profile">
            <div class="cart-item-image">
              <img 
                :src="item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : getPlaceholderImage()" 
                :alt="item.title"
                @error="handleImageError($event)"
              >
            </div>
            <div class="cart-item-info">
              <h4>{{ item.title }}</h4>
              <p>{{ item.author }}</p>
              <p class="cart-item-price">${{ item.discountedPrice || item.price }}</p>
              <div class="quantity-controls">
                <button class="quantity-btn" @click="decreaseQuantity(item)">
                  <i class="bi bi-dash"></i>
                </button>
                <span class="quantity-display">{{ item.quantity || 1 }}</span>
                <button class="quantity-btn" @click="increaseQuantity(item)">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
            </div>
            <button class="remove-item-btn rounded-circle bg-danger text-black start-0" @click="removeFromCart(item.id)" title="Eliminar">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>

      <div v-if="cartList.length > 0" class="profile-modal-footer">
        <div class="cart-total">
          <span>Total: ${{ cartTotal.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default {
  name: "NavbarComponent",
  data() {
    return {
      isAuthenticated: false,
      isAdmin: false,
      userData: null,
      showProfileModal: false,
      showFavoritesModal: false,
      showCartModalFromProfile: false,
      cartCount: 0,
      favoritesCount: 0,
      favoritesList: [],
      cartList: []
    };
  },
  computed: {
    cartTotal() {
      return this.cartList.reduce((total, item) => {
        const price = item.discountedPrice || item.price;
        return total + (price * (item.quantity || 1));
      }, 0);
    }
  },
  mounted() {
    // Observar cambios en el estado de autenticación
    onAuthStateChanged(auth, (user) => {
      this.isAuthenticated = !!user;
      if (user) {
        this.userData = user;
        this.isAdmin = user.email === "admin@nexuslibrary.com";
      } else {
        this.userData = null;
        this.isAdmin = false;
      }
    });

    // Cargar contadores del localStorage
    this.updateCounters();
    
    // Escuchar cambios en el carrito y favoritos
    window.addEventListener('storage', this.updateCounters);
    this.intervalId = setInterval(this.updateCounters, 1000);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.updateCounters);
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    },
    showProfile() {
      this.updateCounters();
      this.showProfileModal = true;
    },
    closeProfileModal() {
      this.showProfileModal = false;
    },
    showCart() {
      // Emitir evento para mostrar el carrito en ProductsView
      window.dispatchEvent(new CustomEvent('show-cart-modal'));
    },
    updateCounters() {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        this.favoritesCount = favorites.length;
        this.cartList = cart;
        this.favoritesList = favorites;
      } catch (error) {
        console.error('Error al actualizar contadores:', error);
      }
    },
    openFavoritesModal() {
      this.updateCounters();
      this.showFavoritesModal = true;
    },
    closeFavoritesModal() {
      this.showFavoritesModal = false;
    },
    showCartModal() {
      this.updateCounters();
      this.showCartModalFromProfile = true;
    },
    closeCartModalFromProfile() {
      this.showCartModalFromProfile = false;
    },
    removeFavorite(bookId) {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const updatedFavorites = favorites.filter(fav => fav.id !== bookId);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        this.updateCounters();
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error al eliminar favorito:', error);
      }
    },
    removeFromCart(bookId) {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.filter(item => item.id !== bookId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        this.updateCounters();
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
      }
    },
    increaseQuantity(item) {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
        if (itemIndex > -1) {
          cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + 1;
          localStorage.setItem('cart', JSON.stringify(cart));
          this.updateCounters();
          window.dispatchEvent(new Event('storage'));
        }
      } catch (error) {
        console.error('Error al aumentar cantidad:', error);
      }
    },
    decreaseQuantity(item) {
      try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const itemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
        if (itemIndex > -1) {
          if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
          } else {
            cart.splice(itemIndex, 1);
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          this.updateCounters();
          window.dispatchEvent(new Event('storage'));
        }
      } catch (error) {
        console.error('Error al disminuir cantidad:', error);
      }
    },
    getPlaceholderImage() {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE3MmE0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODkyYjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==';
    },
    handleImageError(event) {
      event.target.src = this.getPlaceholderImage();
    }
  }
};
</script>

<style src="../assets/estilosCss/navbar.css"></style>
<style src="../assets/estilosCss/profile-modal.css"></style>
