<template>
  <div class="checkout-view">
    <NavbarComponent />
    
    <div class="checkout-container container py-5">
      <div class="row">
        <!-- Resumen del pedido -->
        <div class="col-lg-4 order-lg-2 mb-4">
          <div class="checkout-summary card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="bi bi-cart-check"></i> Resumen del Pedido
              </h3>
            </div>
            <div class="card-body">
              <div class="order-items">
                <div 
                  v-for="(item, index) in cart" 
                  :key="item.id || index" 
                  class="order-item mb-3 pb-3 border-bottom"
                >
                  <div class="d-flex">
                    <div class="order-item-image me-3">
                      <img 
                        :src="item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : getPlaceholderImage()" 
                        :alt="item.title"
                        @error="handleImageError($event)"
                      >
                    </div>
                    <div class="order-item-info flex-grow-1">
                      <h6 class="mb-1">{{ item.title }}</h6>
                      <p class="text-muted small mb-1">{{ item.author }}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="text-muted small">Cantidad: {{ item.quantity || 1 }}</span>
                        <span class="fw-bold">${{ ((item.discountedPrice || item.price) * (item.quantity || 1)).toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="order-totals mt-4">
                <div class="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${{ subtotal.toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Envío:</span>
                  <span>{{ shippingCost === 0 ? 'Gratis' : '$' + shippingCost.toFixed(2) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Impuestos:</span>
                  <span>${{ taxes.toFixed(2) }}</span>
                </div>
                <div class="total-line border-top pt-2 mt-2">
                  <div class="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong class="text-primary fs-5">${{ total.toFixed(2) }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulario de checkout -->
        <div class="col-lg-8 order-lg-1">
          <div class="checkout-form card shadow-sm">
            <div class="card-header">
              <h3 class="mb-0">
                <i class="bi bi-credit-card"></i> Información de Pago
              </h3>
            </div>
            <div class="card-body">
              <!-- Información de envío -->
              <div class="section mb-4">
                <h5 class="section-title mb-3">
                  <i class="bi bi-truck"></i> Información de Envío
                </h5>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre completo *</label>
                    <input 
                      v-model="shippingInfo.fullName" 
                      type="text" 
                      class="form-control" 
                      required
                      placeholder="Juan Pérez"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email *</label>
                    <input 
                      v-model="shippingInfo.email" 
                      type="email" 
                      class="form-control" 
                      required
                      placeholder="juan@example.com"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Teléfono *</label>
                    <input 
                      v-model="shippingInfo.phone" 
                      type="tel" 
                      class="form-control" 
                      required
                      placeholder="+1234567890"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Dirección *</label>
                    <input 
                      v-model="shippingInfo.address" 
                      type="text" 
                      class="form-control" 
                      required
                      placeholder="Calle Principal 123"
                    >
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Ciudad *</label>
                    <input 
                      v-model="shippingInfo.city" 
                      type="text" 
                      class="form-control" 
                      required
                      placeholder="Ciudad"
                    >
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Estado/Provincia *</label>
                    <input 
                      v-model="shippingInfo.state" 
                      type="text" 
                      class="form-control" 
                      required
                      placeholder="Estado"
                    >
                  </div>
                  <div class="col-md-4 mb-3">
                    <label class="form-label">Código Postal *</label>
                    <input 
                      v-model="shippingInfo.zipCode" 
                      type="text" 
                      class="form-control" 
                      required
                      placeholder="12345"
                    >
                  </div>
                </div>
              </div>

              <!-- Método de pago -->
              <div class="section mb-4">
                <h5 class="section-title mb-3">
                  <i class="bi bi-wallet2"></i> Método de Pago
                </h5>
                
                <div class="payment-methods mb-3">
                  <div 
                    v-for="method in paymentMethods" 
                    :key="method.id"
                    class="payment-method-card"
                    :class="{ active: selectedPaymentMethod === method.id }"
                    @click="selectPaymentMethod(method.id)"
                  >
                    <div class="payment-method-icon">
                      <i :class="method.icon"></i>
                    </div>
                    <div class="payment-method-info">
                      <h6>{{ method.name }}</h6>
                      <p class="text-muted small mb-0">{{ method.description }}</p>
                    </div>
                    <div class="payment-method-radio">
                      <input 
                        type="radio" 
                        :value="method.id" 
                        v-model="selectedPaymentMethod"
                        :id="'payment-' + method.id"
                      >
                    </div>
                  </div>
                </div>

                <!-- Formulario de tarjeta de crédito -->
                <div v-if="selectedPaymentMethod === 'card'" class="payment-form">
                  <div class="row">
                    <div class="col-12 mb-3">
                      <label class="form-label">Número de Tarjeta *</label>
                      <input 
                        v-model="cardInfo.number" 
                        type="text" 
                        class="form-control" 
                        placeholder="1234 5678 9012 3456"
                        maxlength="19"
                        @input="formatCardNumber"
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Nombre en la Tarjeta *</label>
                      <input 
                        v-model="cardInfo.name" 
                        type="text" 
                        class="form-control" 
                        placeholder="JUAN PEREZ"
                      >
                    </div>
                    <div class="col-md-3 mb-3">
                      <label class="form-label">Vencimiento *</label>
                      <input 
                        v-model="cardInfo.expiry" 
                        type="text" 
                        class="form-control" 
                        placeholder="MM/AA"
                        maxlength="5"
                        @input="formatExpiry"
                      >
                    </div>
                    <div class="col-md-3 mb-3">
                      <label class="form-label">CVV *</label>
                      <input 
                        v-model="cardInfo.cvv" 
                        type="text" 
                        class="form-control" 
                        placeholder="123"
                        maxlength="4"
                      >
                    </div>
                  </div>
                </div>

                <!-- Información de PayPal (simulado) -->
                <div v-if="selectedPaymentMethod === 'paypal'" class="payment-form">
                  <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    Serás redirigido a PayPal para completar el pago de forma segura.
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Email de PayPal *</label>
                    <input 
                      v-model="paypalInfo.email" 
                      type="email" 
                      class="form-control" 
                      placeholder="tu@email.com"
                    >
                  </div>
                </div>

                <!-- Información de transferencia bancaria -->
                <div v-if="selectedPaymentMethod === 'bank'" class="payment-form">
                  <div class="alert alert-warning">
                    <i class="bi bi-exclamation-triangle"></i>
                    <strong>Instrucciones:</strong> Después de confirmar tu pedido, recibirás los datos bancarios para realizar la transferencia. 
                    Tu pedido será procesado una vez confirmado el pago.
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Banco de preferencia</label>
                    <select v-model="bankInfo.bank" class="form-select">
                      <option value="">Selecciona un banco</option>
                      <option value="banco1">Banco Nacional</option>
                      <option value="banco2">Banco Comercial</option>
                      <option value="banco3">Banco Popular</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="checkout-actions d-flex gap-3">
                <router-link to="/productos" class="btn btn-outline-secondary flex-grow-1">
                  <i class="bi bi-arrow-left"></i> Volver
                </router-link>
                <button 
                  class="btn btn-primary flex-grow-1" 
                  @click="processPayment"
                  :disabled="processing || !isFormValid"
                >
                  <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-check-circle"></i>
                  {{ processing ? 'Procesando...' : 'Confirmar Pago' }}
                </button>
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
  name: "CheckoutView",
  components: {
    NavbarComponent,
    FooterComponent,
  },
  data() {
    return {
      cart: [],
      shippingInfo: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      selectedPaymentMethod: "card",
      paymentMethods: [
        {
          id: "card",
          name: "Tarjeta de Crédito/Débito",
          description: "Visa, Mastercard, American Express",
          icon: "bi bi-credit-card-2-front",
        },
        {
          id: "paypal",
          name: "PayPal",
          description: "Pago rápido y seguro",
          icon: "bi bi-paypal",
        },
        {
          id: "bank",
          name: "Transferencia Bancaria",
          description: "Transferencia directa",
          icon: "bi bi-bank",
        },
      ],
      cardInfo: {
        number: "",
        name: "",
        expiry: "",
        cvv: "",
      },
      paypalInfo: {
        email: "",
      },
      bankInfo: {
        bank: "",
      },
      processing: false,
      shippingCost: 0,
      taxRate: 0.16, // 16% de impuestos
    };
  },
  computed: {
    subtotal() {
      return this.cart.reduce((total, item) => {
        const price = item.discountedPrice || item.price;
        return total + price * (item.quantity || 1);
      }, 0);
    },
    taxes() {
      return this.subtotal * this.taxRate;
    },
    total() {
      return this.subtotal + this.shippingCost + this.taxes;
    },
    isFormValid() {
      // Validar información de envío
      const shippingValid = 
        this.shippingInfo.fullName &&
        this.shippingInfo.email &&
        this.shippingInfo.phone &&
        this.shippingInfo.address &&
        this.shippingInfo.city &&
        this.shippingInfo.state &&
        this.shippingInfo.zipCode;

      // Validar método de pago seleccionado
      let paymentValid = false;
      if (this.selectedPaymentMethod === "card") {
        paymentValid = 
          this.cardInfo.number &&
          this.cardInfo.name &&
          this.cardInfo.expiry &&
          this.cardInfo.cvv;
      } else if (this.selectedPaymentMethod === "paypal") {
        paymentValid = this.paypalInfo.email;
      } else if (this.selectedPaymentMethod === "bank") {
        paymentValid = true; // Transferencia bancaria no requiere validación inmediata
      }

      return shippingValid && paymentValid && this.cart.length > 0;
    },
  },
  created() {
    this.loadCart();
    this.loadUserInfo();
    
    // Si el carrito está vacío, redirigir a productos
    if (this.cart.length === 0) {
      this.$router.push("/productos");
    }
  },
  methods: {
    loadCart() {
      try {
        const savedCart = localStorage.getItem("cart");
        this.cart = savedCart ? JSON.parse(savedCart) : [];
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
        this.cart = [];
      }
    },
    loadUserInfo() {
      // Cargar información del usuario si está autenticado
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        if (userData.email) {
          this.shippingInfo.email = userData.email;
          this.shippingInfo.fullName = userData.displayName || "";
        }
      } catch (error) {
        console.error("Error al cargar información del usuario:", error);
      }
    },
    selectPaymentMethod(methodId) {
      this.selectedPaymentMethod = methodId;
    },
    formatCardNumber(event) {
      let value = event.target.value.replace(/\s/g, "");
      let formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
      this.cardInfo.number = formattedValue;
    },
    formatExpiry(event) {
      let value = event.target.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      this.cardInfo.expiry = value;
    },
    async processPayment() {
      if (!this.isFormValid) {
        this.showNotification("Por favor completa todos los campos requeridos", "error");
        return;
      }

      this.processing = true;

      try {
        // Simular procesamiento de pago
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Crear orden
        const order = {
          id: this.generateOrderId(),
          items: this.cart,
          shippingInfo: { ...this.shippingInfo },
          paymentMethod: this.selectedPaymentMethod,
          paymentInfo: this.getPaymentInfo(),
          subtotal: this.subtotal,
          shipping: this.shippingCost,
          taxes: this.taxes,
          total: this.total,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        // Guardar orden en localStorage (en producción, esto iría a un backend)
        this.saveOrder(order);

        // Limpiar carrito
        localStorage.removeItem("cart");
        this.cart = [];

        // Mostrar notificación de éxito
        this.showNotification("¡Pago procesado exitosamente!", "success", 3000);

        // Redirigir a página de confirmación
        setTimeout(() => {
          this.$router.push({
            name: "OrderConfirmation",
            params: { orderId: order.id },
          });
        }, 1000);
      } catch (error) {
        console.error("Error al procesar el pago:", error);
        this.showNotification("Error al procesar el pago. Intenta de nuevo.", "error");
      } finally {
        this.processing = false;
      }
    },
    getPaymentInfo() {
      if (this.selectedPaymentMethod === "card") {
        return {
          type: "card",
          last4: this.cardInfo.number.slice(-4),
        };
      } else if (this.selectedPaymentMethod === "paypal") {
        return {
          type: "paypal",
          email: this.paypalInfo.email,
        };
      } else {
        return {
          type: "bank",
          bank: this.bankInfo.bank,
        };
      }
    },
    generateOrderId() {
      return "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    },
    saveOrder(order) {
      try {
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
      } catch (error) {
        console.error("Error al guardar la orden:", error);
      }
    },
    showNotification(message, type = "success", duration = 2000) {
      const notification = document.createElement("div");
      const iconClass =
        type === "success"
          ? "bi-check-circle-fill"
          : type === "error"
          ? "bi-x-circle-fill"
          : "bi-info-circle-fill";
      const bgColor =
        type === "success"
          ? "rgba(76, 201, 240, 0.9)"
          : type === "error"
          ? "rgba(248, 113, 113, 0.9)"
          : "rgba(59, 130, 246, 0.9)";

      notification.className = "cart-notification show";
      notification.style.background = bgColor;
      notification.innerHTML = `
        <div class="cart-notification-content">
          <i class="bi ${iconClass}"></i>
          <span>${message}</span>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      }, duration);
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

<style scoped src="../assets/estilosCss/checkout.css"></style>
