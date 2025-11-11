<template>
  <main class="nexus-main container" role="main">

    <section class="hero-section" role="region" aria-label="Presentación principal">
      <div class="hero-content">
        <h1 class="hero-title">
          Descubre el <span class="highlight">futuro</span> de la lectura
        </h1>
        <p class="hero-subtitle">
          Una experiencia inmersiva donde la tecnología y la literatura convergen
        </p>

        <div class="hero-actions">
          <button class="primary-btn btn" @click="openCollectionModal">
            <i class="bi bi-collection"></i> Explorar colección en descuento
          </button>

          <button class="secondary-btn btn" @click="openEventsModal">
            <i class="bi bi-calendar-check"></i> Próximos eventos de la librería
          </button>
        </div>
      </div>
    </section>

    <section class="features-section scroll-animation" role="region" aria-label="Características principales">
      <div class="feature-card col-12 col-md-4">
        <div class="feature-icon rounded-circle d-flex align-items-center justify-content-center mb-3">
          <i class="bi bi-telephone-plus fs-3"></i>
        </div>
        <h3>Contacto</h3>
        <p>Comunicate con nosotros a traves del correo:
          <a class="info-Correo" href="mailto:info@nexuslibrary.com">info@nexuslibrary.com</a> o deja un comentario
        </p>
      </div>

      <div class="feature-card col-12 col-md-4">
        <div class="feature-icon rounded-circle d-flex align-items-center justify-content-center mb-3">
          <i class="bi bi-person-vcard fs-3"></i>
        </div>
        <h3>Membresia <span class="premium">VIP</span></h3>
        <p>
          Accede a contenido exclusivo, eventos privados y ofertas exclusivas.
        </p>
        <button class="btn primary-btn" style="margin-top: 1.3rem;" @click="openMembershipModal">
          Únete ahora
        </button>
      </div>

      <div class="feature-card col-12 col-md-4">
        <div class="feature-icon rounded-circle d-flex align-items-center justify-content-center mb-3">
          <i class="bi bi-chat-left-dots fs-3"></i>
        </div>
        <h3>Comunidad Nexus</h3>
        <p>
          Únete a nuestra comunidad de lectores y comparte tus opiniones y recomendaciones.
        </p>
        <button class="btn primary-btn" @click="redirectToDiscord">
          <i class="bi bi-discord"></i> Unirte
        </button>
      </div>
    </section>

    <section class="newsletter-section scroll-animation" role="region" aria-label="Suscríbete a nuestro newsletter">
      <div class="newsletter-container">
        <div class="text">
          <p id="two" class="fw-semibold">Tu curiosidad nos inspira</p>
          <p id="three">Escríbenos sin temor para resolver tus dudas.</p>
        </div>
        <form class="newsletter-form" @submit.prevent="handleSubmit" novalidate>
          <div>
            <label for="nombre" class="form-label visually-hidden">Nombre</label>
            <input type="text" id="nombre" name="nombre" placeholder="Nombre" required v-model="formData.nombre">
            <div class="invalid-feedback">Por favor, ingresa tu nombre.</div>
          </div>
          <div>
            <label for="email" class="form-label visually-hidden">Email</label>
            <input type="email" id="email" name="email" placeholder="Correo electrónico" required
              v-model="formData.email">
            <div class="invalid-feedback">Por favor, ingresa un correo válido.</div>
          </div>
          <div>
            <label for="telefono" class="form-label visually-hidden">Teléfono</label>
            <input type="tel" id="telefono" name="telefono" placeholder="Teléfono" pattern="[0-9]{10,15}" required
              v-model="formData.telefono">
            <div class="invalid-feedback">Por favor, ingresa un teléfono válido.</div>
          </div>
          <div>
            <label for="mensaje" class="form-label visually-hidden">Mensaje</label>
            <textarea id="mensaje" name="mensaje" placeholder="Mensaje" rows="1" required
              v-model="formData.mensaje"></textarea>
            <div class="invalid-feedback">Por favor, escribe tu mensaje.</div>
          </div>
          <div>
            <button type="submit" class="btn primary-btn px-4" id="contact-btn">¡Háblanos!</button>
          </div>
        </form>
      </div>
    </section>

    <!-- Modal de Colección -->
    <div class="modal-overlay" :class="{ show: showCollectionModal }" @click.self="closeModal"
      v-if="showCollectionModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="modal-header">
          <h2><i class="bi bi-collection"></i> Libros en Oferta</h2>
        </div>

        <div class="modal-body">
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <div v-else-if="discountedBooks.length === 0" class="text-center py-4">
            <p class="text-white">No hay libros en oferta en este momento.</p>
          </div>

          <div v-else class="row g-3">
            <div v-for="book in discountedBooks" :key="book.id" class="col-md-6 col-lg-4">
              <div class="book-card" @click="showBookDetails(book)">
                <img
                  :src="book.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE3MmE0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODkyYjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg=='"
                  class="book-image" :alt="book.title">
                <div class="book-info">
                  <h5 class="book-title">{{ book.title }}</h5>
                  <p class="book-author">{{ book.author }}</p>
                  <div class="price-container">
                    <span class="original-price">${{ book.price }}</span>
                    <span class="discounted-price">${{ book.discountedPrice }}</span>
                  </div>
                  <div class="discount-badge">-{{ book.discountPercentage }}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Eventos -->
    <div class="modal-overlay" :class="{ show: showEventsModal }" @click.self="closeModal" v-if="showEventsModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="modal-header">
          <h2><i class="bi bi-calendar-check"></i> Próximos Eventos</h2>
        </div>

        <div class="modal-body">
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
          </div>

          <div v-else-if="events.length === 0" class="text-center py-4">
            <p class="text-white">No hay eventos programados en este momento.</p>
          </div>

          <div v-else class="row g-3">
            <div v-for="event in events" :key="event.id" class="col-12">
              <div class="event-card" @click="showEventDetails(event)">
                <div class="event-date">{{ formatEventDate(event.date) }}</div>
                <div class="event-details">
                  <h5 class="event-title">{{ event.title }}</h5>
                  <p class="event-location">
                    <i class="bi bi-geo-alt"></i> {{ event.location || 'Ubicación por confirmar' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de membresía -->
    <div class="modal-overlay" :class="{ show: showMembershipModal }" @click.self="closeModal"
      v-if="showMembershipModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>

        <div class="modal-header">
          <h2><i class="bi bi-person-vcard"></i> Membresía <span class="premium">VIP</span></h2>
        </div>

        <div class="membership-modal-body">
          <div class="membership-plans">
            <div class="plan-card">
              <div class="plan-badge">Más Popular</div>
              <h3><span class="premium">VIP</span> Anual</h3>
              <div class="plan-price">
                <span class="price">$99</span>
                <span class="period">/año</span>
              </div>
              <ul class="plan-features">
                <li><i class="bi bi-check-circle-fill"></i> Eventos exclusivos VIP</li>
                <li><i class="bi bi-check-circle-fill"></i> Descuentos del 30% en libros físicos</li>
                <li><i class="bi bi-check-circle-fill"></i> Acceso anticipado a nuevos lanzamientos</li>              </ul>
            </div>
            <div class="plan-card">
              <div class="plan-badge">Economico</div>
              <h3><span class="premium">VIP</span> Mensual</h3>
              <div class="plan-price">
                <span class="price">$12</span>
                <span class="period">/mes</span>
              </div>
              <ul class="plan-features">
                <li><i class="bi bi-check-circle-fill"></i> Eventos exclusivos VIP</li>
                <li><i class="bi bi-check-circle-fill"></i> Descuentos del 15% en libros físicos</li>
                <li><i class="bi bi-check-circle-fill"></i> Soporte prioritario</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

// Estados para los modales
const showCollectionModal = ref(false);
const showEventsModal = ref(false);
const showMembershipModal = ref(false);
const discountedBooks = ref([]);
const events = ref([]);
const loading = ref(false);

// Datos del formulario
const formData = reactive({
  nombre: '',
  email: '',
  telefono: '',
  mensaje: ''
});

// Cargar libros en oferta desde Firebase
const loadDiscountedBooks = async () => {
  loading.value = true;
  try {
    const booksCollection = collection(db, 'books');
    const querySnapshot = await getDocs(booksCollection);

    discountedBooks.value = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        const bookData = { id: doc.id, ...data };

        // Calcular precio con descuento
        if (bookData.discountPercentage && bookData.discountPercentage > 0) {
          bookData.discountedPrice = parseFloat(
            (bookData.price * (1 - bookData.discountPercentage / 100)).toFixed(2)
          );
        }
        return bookData;
      })
      .filter(book => book.discountPercentage > 0);
  } catch (error) {
    console.error('Error al cargar libros en oferta:', error);
    alert('Error al cargar la colección. Por favor, intenta de nuevo.');
  } finally {
    loading.value = false;
  }
};

// Cargar eventos desde Firebase
const loadEvents = async () => {
  loading.value = true;
  try {
    const eventsCollection = collection(db, 'events');
    const querySnapshot = await getDocs(eventsCollection);

    events.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const eventData = { id: doc.id, ...data };

      // Convertir Timestamp de Firestore a Date
      if (eventData.date && eventData.date.toDate) {
        eventData.date = eventData.date.toDate();
      } else if (eventData.date && typeof eventData.date === 'string') {
        eventData.date = new Date(eventData.date);
      }

      return eventData;
    });
  } catch (error) {
    console.error('Error al cargar eventos:', error);
    alert('Error al cargar eventos. Por favor, intenta de nuevo.');
  } finally {
    loading.value = false;
  }
};

// Abrir modal de colección
const openCollectionModal = async () => {
  await loadDiscountedBooks();
  showCollectionModal.value = true;
};

// Abrir modal de eventos
const openEventsModal = async () => {
  await loadEvents();
  showEventsModal.value = true;
};

// Abrir modal de membresía
const openMembershipModal = () => {
  showMembershipModal.value = true;
};

// Cerrar modales
const closeModal = () => {
  showCollectionModal.value = false;
  showEventsModal.value = false;
  showMembershipModal.value = false;
};

// Formatear fecha para eventos
const formatEventDate = (date) => {
  if (!date) return 'Fecha no disponible';
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return 'Fecha no disponible';

    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Fecha no disponible';
  }
};

// Redirigir a Discord
const redirectToDiscord = () => {
  window.location.href = 'https://discord.gg/nexuslibrary';
};

// Mostrar notificación estilizada
const showNotification = (message) => {
  const notification = document.createElement('div');
  notification.className = 'nexus-notification show';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="bi bi-info-circle-fill"></i>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};


// Manejar submit del formulario
const handleSubmit = () => {
  if (!formData.nombre || !formData.email || !formData.telefono || !formData.mensaje) {
    alert('Por favor, completa todos los campos del formulario.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    alert('Por favor, ingresa un correo electrónico válido.');
    return;
  }

  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(formData.telefono)) {
    alert('Por favor, ingresa un teléfono válido (10-15 dígitos).');
    return;
  }

  showNotification('¡Mensaje enviado con éxito!');

  Object.keys(formData).forEach(key => {
    formData[key] = '';
  });
};

// Animaciones
const setupScrollAnimations = () => {
  try {
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observerInstance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.scroll-animation').forEach(el => observer.observe(el));
  } catch (error) {
    document.querySelectorAll('.scroll-animation').forEach(el => el.classList.add('animate-in'));
  }
};

onMounted(() => {
  setupScrollAnimations();
});
</script>



<style src="../assets/estilosCss/style.css"></style>