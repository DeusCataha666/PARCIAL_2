<template>
  <header>
    <nav class="navbar navbar-expand-lg">
      <div class="container">
        <div class="logo">
          <span class="logo-part">NEXUS</span>
          <span class="logo-part">LIBRARY</span>
        </div>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <div class="d-flex align-items-center gap-3">
            <!-- Si NO está autenticado, solo muestra el botón de inicio de sesión -->
            <template v-if="!isAuthenticated">
              <router-link to="/login" class="btn btn-light">
                <i class="bi bi-person-circle"></i> Iniciar Sesión
              </router-link>
            </template>

            <!-- Si está autenticado, muestra los botones de perfil y cerrar sesión -->
            <template v-else>
              <!-- Panel Admin (solo si es administrador) -->
              <router-link v-if="isAdmin" to="/admin" class="btn btn-warning">
                <i class="bi bi-gear-fill"></i> Panel Admin
              </router-link>

              <!-- Botón de carrito (solo para usuarios no admin) -->
              <button v-if="!isAdmin" class="btn btn-light position-relative" @click="showCart">
                <i class="bi bi-cart"></i> Carrito
                <span v-if="cartCount > 0" class="position-relativa translate-middle badge rounded-pill bg-danger "
                  style=""
                  >
                  {{ cartCount }}
                </span>
              </button>



              <!-- Botón de perfil (solo para usuarios no admin) -->
              <button v-if="!isAdmin" class="btn btn-light" @click="showProfile">
                <i class="bi bi-person-circle"></i> Mi Perfil
              </button>

              <!-- Botón de cerrar sesión -->
              <button class="btn btn-outline-danger" @click="logout">
                <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
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
          <div class="profile-info-item">
            <label>ID de Usuario:</label>
            <span>{{ userData?.uid?.substring(0, 8) || 'No disponible' }}...</span>
          </div>
        </div>

        <div class="profile-stats-section">
          <h3><i class="bi bi-bar-chart"></i> Estadísticas</h3>
          <div class="profile-stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <i class="bi bi-heart-fill"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ favoritesCount }}</div>
                <div class="stat-label">Favoritos</div>
              </div>
            </div>
            <div class="stat-card">
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
      cartCount: 0,
      favoritesCount: 0
    };
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
      } catch (error) {
        console.error('Error al actualizar contadores:', error);
      }
    }
  }
};
</script>

<style src="../assets/estilosCss/navbar.css"></style>
<style src="../assets/estilosCss/profile-modal.css"></style>
