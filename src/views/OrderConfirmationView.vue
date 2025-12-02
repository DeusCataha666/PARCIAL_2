<template>
  <div class="order-confirmation-view">
    <NavbarComponent />
    
    <div class="confirmation-container container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="confirmation-card card shadow-lg">
            <div class="card-body text-center p-5">
              <div class="success-icon mb-4">
                <i class="bi bi-check-circle-fill"></i>
              </div>
              
              <h2 class="mb-3">¡Pedido Confirmado!</h2>
              <p class="text-muted mb-4">
                Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
              </p>

              <div v-if="order" class="order-details mt-4">
                <div class="order-id-box p-3 mb-4 bg-light rounded">
                  <p class="mb-1 text-muted small">Número de Pedido</p>
                  <h4 class="mb-0 fw-bold text-primary">{{ order.id }}</h4>
                </div>

                <div class="order-summary text-start">
                  <h5 class="mb-3">Resumen del Pedido</h5>
                  
                  <div class="order-items mb-4">
                    <div 
                      v-for="(item, index) in order.items" 
                      :key="item.id || index" 
                      class="order-item-summary d-flex align-items-center mb-3 pb-3 border-bottom"
                    >
                      <div class="item-image me-3">
                        <img 
                          :src="item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : getPlaceholderImage()" 
                          :alt="item.title"
                          @error="handleImageError($event)"
                        >
                      </div>
                      <div class="item-info flex-grow-1">
                        <h6 class="mb-1">{{ item.title }}</h6>
                        <p class="text-muted small mb-0">{{ item.author }}</p>
                        <p class="mb-0">Cantidad: {{ item.quantity || 1 }}</p>
                      </div>
                      <div class="item-price">
                        <strong>${{ ((item.discountedPrice || item.price) * (item.quantity || 1)).toFixed(2) }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="order-totals bg-light p-3 rounded">
                    <div class="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>${{ order.subtotal.toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span>Envío:</span>
                      <span>{{ order.shipping === 0 ? 'Gratis' : '$' + order.shipping.toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                      <span>Impuestos:</span>
                      <span>${{ order.taxes.toFixed(2) }}</span>
                    </div>
                    <div class="d-flex justify-content-between pt-2 border-top">
                      <strong>Total:</strong>
                      <strong class="text-primary fs-5">${{ order.total.toFixed(2) }}</strong>
                    </div>
                  </div>

                  <div class="shipping-info mt-4">
                    <h5 class="mb-3">Información de Envío</h5>
                    <div class="bg-light p-3 rounded">
                      <p class="mb-1"><strong>{{ order.shippingInfo.fullName }}</strong></p>
                      <p class="mb-1 text-muted">{{ order.shippingInfo.address }}</p>
                      <p class="mb-1 text-muted">
                        {{ order.shippingInfo.city }}, {{ order.shippingInfo.state }} {{ order.shippingInfo.zipCode }}
                      </p>
                      <p class="mb-0 text-muted">{{ order.shippingInfo.phone }}</p>
                    </div>
                  </div>

                  <div class="payment-info mt-4">
                    <h5 class="mb-3">Método de Pago</h5>
                    <div class="bg-light p-3 rounded">
                      <p class="mb-0">
                        <i :class="getPaymentIcon(order.paymentMethod)"></i>
                        {{ getPaymentMethodName(order.paymentMethod) }}
                        <span v-if="order.paymentMethod === 'card' && order.paymentInfo.last4">
                          •••• {{ order.paymentInfo.last4 }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div class="confirmation-actions mt-5">
                  <router-link to="/productos" class="btn btn-primary me-2 mb-2 mb-md-0">
                    <i class="bi bi-arrow-left"></i> Continuar Comprando
                  </router-link>
                  <button class="btn btn-outline-secondary" @click="printOrder">
                    <i class="bi bi-printer"></i> Imprimir
                  </button>
                </div>
              </div>

              <div v-else class="loading-state">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3">Cargando información del pedido...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script>
import NavbarComponent from "../components/NavbarComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";

export default {
  name: "OrderConfirmationView",
  components: {
    NavbarComponent,
    FooterComponent,
  },
  data() {
    return {
      order: null,
    };
  },
  created() {
    this.loadOrder();
  },
  methods: {
    loadOrder() {
      const orderId = this.$route.params.orderId;
      try {
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        this.order = orders.find((o) => o.id === orderId);
        
        if (!this.order) {
          // Si no se encuentra la orden, redirigir a productos
          this.$router.push("/productos");
        }
      } catch (error) {
        console.error("Error al cargar la orden:", error);
        this.$router.push("/productos");
      }
    },
    getPaymentMethodName(method) {
      const methods = {
        card: "Tarjeta de Crédito/Débito",
        paypal: "PayPal",
        bank: "Transferencia Bancaria",
      };
      return methods[method] || method;
    },
    getPaymentIcon(method) {
      const icons = {
        card: "bi bi-credit-card-2-front",
        paypal: "bi bi-paypal",
        bank: "bi bi-bank",
      };
      return icons[method] || "bi bi-wallet2";
    },
    printOrder() {
      window.print();
    },
    getPlaceholderImage() {
      return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzE3MmE0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM4ODkyYjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gSW1hZ2VuPC90ZXh0Pjwvc3ZnPg==";
    },
    handleImageError(event) {
      event.target.src = this.getPlaceholderImage();
    },
  },
};
</script>

<style scoped>
.order-confirmation-view {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, var(--primary-bg) 0%, #0d1b2a 50%, var(--primary-bg) 100%);
  background-attachment: fixed;
  padding-bottom: 2rem;
}

.confirmation-container {
  max-width: 900px;
  padding: 2rem 1rem;
}

.confirmation-card {
  border-radius: 16px;
  overflow: hidden;
  border: none;
  background: var(--glass-effect);
  border: 2px solid var(--glass-border);
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 40px rgba(76, 201, 240, 0.2);
}

.confirmation-card .card-body {
  background: transparent;
  color: var(--text-primary);
}

.success-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-color), var(--hover-btn));
  border-radius: 50%;
  box-shadow: 0 8px 25px rgba(76, 201, 240, 0.4);
}

.success-icon i {
  font-size: 4rem;
  color: var(--primary-bg);
}

.confirmation-card h2 {
  color: var(--text-primary);
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
}

.confirmation-card .text-muted {
  color: var(--text-secondary) !important;
}

.order-id-box {
  border: 2px dashed var(--accent-color);
  background: rgba(76, 201, 240, 0.1);
}

.order-id-box .text-muted {
  color: var(--text-secondary) !important;
}

.order-id-box h4 {
  color: var(--accent-color);
  font-family: 'Orbitron', sans-serif;
}

.order-summary h5 {
  color: var(--text-primary);
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
}

.item-image {
  width: 60px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--glass-border);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-item-summary h6 {
  color: var(--text-primary);
}

.order-item-summary .text-muted {
  color: var(--text-secondary) !important;
}

.order-totals {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid var(--glass-border) !important;
}

.order-totals span {
  color: var(--text-primary);
}

.order-totals .text-primary {
  color: var(--accent-color) !important;
}

.shipping-info h5,
.payment-info h5 {
  color: var(--text-primary);
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
}

.shipping-info .bg-light,
.payment-info .bg-light {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid var(--glass-border) !important;
  color: var(--text-primary) !important;
}

.shipping-info .bg-light p,
.payment-info .bg-light p {
  color: var(--text-primary) !important;
}

.shipping-info .bg-light .text-muted {
  color: var(--text-secondary) !important;
}

.confirmation-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.confirmation-actions .btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
}

.confirmation-actions .btn-primary {
  background: linear-gradient(135deg, var(--accent-color), var(--hover-btn));
  color: var(--primary-bg);
  border: none;
  box-shadow: 0 4px 15px rgba(76, 201, 240, 0.3);
}

.confirmation-actions .btn-primary:hover {
  background: linear-gradient(135deg, var(--hover-btn), var(--accent-color));
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 201, 240, 0.5);
  color: var(--primary-bg);
}

.confirmation-actions .btn-outline-secondary {
  color: var(--text-primary);
  border-color: var(--glass-border);
  background: transparent;
}

.confirmation-actions .btn-outline-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--accent-color);
  color: var(--text-primary);
}

.loading-state {
  color: var(--text-primary);
}

.loading-state .spinner-border {
  color: var(--accent-color);
}

@media (max-width: 768px) {
  .confirmation-container {
    padding: 1rem 0.5rem;
  }

  .confirmation-card .card-body {
    padding: 1.5rem 1rem;
  }

  .success-icon {
    width: 80px;
    height: 80px;
  }

  .success-icon i {
    font-size: 3rem;
  }

  .confirmation-card h2 {
    font-size: 1.5rem;
  }

  .order-item-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .item-image {
    width: 100%;
    height: 150px;
    margin-bottom: 0.75rem;
  }

  .item-info {
    width: 100%;
  }

  .confirmation-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .confirmation-actions .btn {
    width: 100%;
    max-width: 100%;
    min-width: auto;
  }
}

@media (max-width: 576px) {
  .confirmation-container {
    padding: 0.5rem;
  }

  .confirmation-card .card-body {
    padding: 1rem 0.75rem;
  }

  .success-icon {
    width: 70px;
    height: 70px;
  }

  .success-icon i {
    font-size: 2.5rem;
  }

  .confirmation-card h2 {
    font-size: 1.2rem;
  }

  .order-id-box {
    padding: 0.75rem;
  }

  .order-id-box h4 {
    font-size: 1rem;
  }

  .order-summary h5,
  .shipping-info h5,
  .payment-info h5 {
    font-size: 1rem;
  }

  .item-image {
    height: 120px;
  }

  .order-totals {
    padding: 0.75rem !important;
  }
}

@media print {
  .order-confirmation-view {
    background: white;
  }
  
  .confirmation-actions {
    display: none;
  }
}
</style>
