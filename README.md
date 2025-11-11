# 📚 PARCIAL 2 - Sistema de Gestión de Libros



> Sistema web completo de gestión de libros con autenticación, CRUD y consumo de APIs desarrollado con Vue.js 3 y Firebas



## 📖 Descripción General del Negocio

### Contexto del Negocio

Este proyecto simula un **sistema de gestión bibliotecaria digital** para una biblioteca o tienda de libros moderna. El negocio se enfoca en:

- **Digitalización del inventario**: Mantener un catálogo digital actualizado de todos los libros disponibles
- **Gestión de usuarios**: Permitir que los clientes se registren y gestionen sus perfiles
- **Administración centralizada**: Facilitar a los administradores la gestión del catálogo desde cualquier lugar
- **Experiencia del usuario**: Proporcionar una interfaz intuitiva para buscar y consultar libros

### Modelo de Negocio

1. **Usuarios Finales (Clientes)**:
   - Pueden registrarse en la plataforma
   - Consultan el catálogo de libros disponibles
   - Visualizan detalles de cada libro (título, autor, precio, descripción)
   - Actualizan su perfil personal

2. **Administradores**:
   - Gestionan el inventario completo de libros
   - Agregan nuevos libros al catálogo
   - Actualizan información de libros existentes
   - Eliminan libros descontinuados
   - Acceden a panel administrativo con estadísticas

3. **Flujo del Negocio**:
   ```
   Cliente → Registro/Login → Catálogo de Libros → Consulta Detalles
                                      ↓
   Administrador → Panel Admin → Gestión CRUD de Libros → Base de Datos
   ```

---

## 🎯 Objetivo de la Aplicación

### Objetivo Principal

Desarrollar una plataforma web moderna y escalable que permita la **gestión integral de un catálogo de libros** con las siguientes capacidades:

### Objetivos Específicos

1. **Gestión de Usuarios**
   - Implementar sistema de registro y autenticación seguro
   - Permitir gestión de perfiles de usuario
   - Diferenciar roles (usuario/administrador)

2. **Gestión de Inventario**
   - Crear, leer, actualizar y eliminar libros (CRUD completo)
   - Almacenar información detallada de cada libro
   - Mantener sincronización en tiempo real con Firebase

3. **Integración con APIs Externas**
   - Consumir datos de APIs externas para enriquecer el catálogo
   - Mostrar información adicional de libros
   - Sincronizar datos entre fuentes múltiples

4. **Experiencia de Usuario**
   - Proporcionar interfaz responsive y moderna
   - Implementar navegación intuitiva
   - Ofrecer feedback visual en todas las acciones

5. **Escalabilidad y Mantenibilidad**
   - Arquitectura modular y componentes reutilizables
   - Código limpio y bien documentado
   - Facilidad para agregar nuevas funcionalidades

---

## 🧩 Modularización

El proyecto implementa una arquitectura modular siguiendo el patrón de **Componentes Vue.js** y **separación de responsabilidades**:

### 1. Componentes Reutilizables

#### NavbarComponent.vue
**Responsabilidad:** Barra de navegación global

**Características:**
- Componente independiente y reutilizable
- Recibe props para configuración dinámica
- Emite eventos de navegación al componente padre
- Gestiona su propio estado local (menú móvil)

**Props recibidos:**
```javascript
props: {
  user: Object,           // Información del usuario logueado
  isLoggedIn: Boolean     // Estado de autenticación
}
```

**Eventos emitidos:**
```javascript
emits: ['logout', 'navigate']
```

**Uso:**
```vue
<NavbarComponent 
  :user="currentUser" 
  :isLoggedIn="isAuthenticated"
  @logout="handleLogout"
/>
```

---

#### FooterComponent.vue
**Responsabilidad:** Pie de página informativo

**Características:**
- Componente completamente independiente
- No recibe props (información estática)
- Estilos encapsulados en `footer.css`
- Reutilizable en todas las vistas

**Uso:**
```vue
<FooterComponent />
```

---

#### NexusComponent.vue
**Responsabilidad:** Componente personalizado para funcionalidades específicas

**Características:**
- Componente modular con lógica de negocio específica
- Recibe y emite datos según necesidad
- Estado interno gestionado con `data()` y `computed`

**Props recibidos:**
```javascript
props: {
  data: Array,            // Datos a procesar
  config: Object          // Configuración del componente
}
```

**Eventos emitidos:**
```javascript
emits: ['update', 'delete', 'select']
```

---

### 2. Vistas (Views)

Cada vista es un componente de alto nivel que **orquesta componentes hijos**:

#### LoginView.vue
**Responsabilidad:** Autenticación de usuarios

**Componentes utilizados:**
- Formularios propios
- Validación interna

**Comunicación:**
- Emite evento `login-success` al componente padre (App.vue)
- Recibe estado de error como prop

---

#### RegisterView.vue
**Responsabilidad:** Registro de nuevos usuarios

**Componentes utilizados:**
- Modal de perfil (comunicación mediante props)

**Comunicación:**
```vue
<ProfileModal 
  :isOpen="showModal"
  :userData="newUser"
  @close="showModal = false"
  @save="handleSaveProfile"
/>
```

---

#### DashboardView.vue
**Responsabilidad:** Panel principal post-login

**Componentes utilizados:**
- `NavbarComponent`
- `FooterComponent`
- Cards de estadísticas (props)

**Comunicación:**
```vue
<template>
  <NavbarComponent 
    :user="currentUser" 
    @logout="logout"
  />
  
  <div class="dashboard-content">
    <StatCard 
      v-for="stat in statistics" 
      :key="stat.id"
      :title="stat.title"
      :value="stat.value"
      @click="handleStatClick(stat.id)"
    />
  </div>
  
  <FooterComponent />
</template>
```

---

#### ProductsView.vue
**Responsabilidad:** Gestión del catálogo de libros (CRUD)

**Componentes utilizados:**
- Lista de libros (renderizado con `v-for`)
- Modal de edición (props y eventos)
- Componente de búsqueda (v-model)

**Comunicación mediante props y eventos:**
```vue
<template>
  <!-- Búsqueda -->
  <SearchBar 
    v-model="searchQuery"
    @search="handleSearch"
  />
  
  <!-- Lista de libros -->
  <BookCard
    v-for="book in filteredBooks"
    :key="book.id"
    :book="book"
    @edit="openEditModal"
    @delete="handleDelete"
  />
  
  <!-- Modal de edición -->
  <EditModal
    :isOpen="showEditModal"
    :book="selectedBook"
    @close="closeEditModal"
    @save="handleUpdate"
  />
</template>

<script>
export default {
  data() {
    return {
      books: [],
      searchQuery: '',
      showEditModal: false,
      selectedBook: null
    }
  },
  methods: {
    openEditModal(book) {
      this.selectedBook = book
      this.showEditModal = true
    },
    handleUpdate(updatedBook) {
      // Lógica de actualización
      this.$emit('book-updated', updatedBook)
    }
  }
}
</script>
```

---

#### AdminPanelView.vue
**Responsabilidad:** Panel administrativo avanzado

**Componentes utilizados:**
- Tablas de datos (props)
- Gráficos estadísticos
- Componentes de filtros

---

### 3. Servicios (Services)

#### api.js
**Responsabilidad:** Centralizar llamadas a APIs externas

**Modularización:**
```javascript
// src/services/api.js
const API_BASE_URL = 'https://api.example.com'

export default {
  // Obtener libros desde API externa
  async getBooks() {
    try {
      const response = await fetch(`${API_BASE_URL}/books`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching books:', error)
      throw error
    }
  },

  // Obtener libro específico
  async getBookById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`)
      return await response.json()
    } catch (error) {
      console.error('Error fetching book:', error)
      throw error
    }
  }
}
```

**Uso en componentes:**
```javascript
import apiService from '@/services/api'

export default {
  async mounted() {
    this.books = await apiService.getBooks()
  }
}
```

---

### 4. Router (Rutas Modulares)

#### index.js
**Responsabilidad:** Gestión de rutas y navegación

**Modularización:**
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ProductsView from '@/views/ProductsView.vue'
import AdminPanelView from '@/views/AdminPanelView.vue'
import RegisterView from '@/views/RegisterView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanelView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegación (modularizado)
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('user')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
```

---

### 5. Estilos Modulares (CSS)

Cada componente tiene su propio archivo CSS:

```
assets/estilosCss/
├── books.css          → Estilos para ProductsView
├── footer.css         → Estilos para FooterComponent
├── navbar.css         → Estilos para NavbarComponent
├── profile-modal.css  → Estilos para modal de perfil
└── style.css          → Estilos globales
```

**Ventajas:**
- ✅ Estilos encapsulados por componente
- ✅ Fácil mantenimiento
- ✅ Evita conflictos de clases CSS
- ✅ Carga selectiva de estilos

---

## 🔌 API Externa

### Descripción de la API Utilizada

El proyecto consume la **[FakeStore API](https://fakestoreapi.com/)** o una API similar para gestionar el catálogo de productos/libros.

### Base URL
```
https://fakestoreapi.com
```

### Endpoints Consumidos

#### 1. GET - Listar todos los productos
```http
GET /products
```

**Descripción:** Obtiene el listado completo de productos disponibles.

**Ejemplo de uso en el proyecto:**
```javascript
// src/services/api.js
export default {
  async getBooks() {
    try {
      const response = await fetch('https://fakestoreapi.com/products')
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error:', error)
      throw error
    }
  }
}
```

**Respuesta de la API:**
```json
[
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack",
    "price": 109.95,
    "description": "Your perfect pack for everyday use...",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
  },
  {
    "id": 2,
    "title": "Mens Casual Premium Slim Fit T-Shirts",
    "price": 22.3,
    "description": "Slim-fitting style...",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
  }
]
```

**Uso en ProductsView.vue:**
```vue
<script>
import apiService from '@/services/api'

export default {
  data() {
    return {
      products: [],
      loading: false
    }
  },
  async mounted() {
    await this.loadProducts()
  },
  methods: {
    async loadProducts() {
      this.loading = true
      try {
        this.products = await apiService.getBooks()
      } catch (error) {
        console.error('Error cargando productos:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

---

#### 2. GET - Obtener producto específico
```http
GET /products/:id
```

**Descripción:** Obtiene detalles de un producto específico por su ID.

**Ejemplo:**
```javascript
async getBookById(id) {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`)
  return await response.json()
}
```

**Respuesta:**
```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack",
  "price": 109.95,
  "description": "Your perfect pack for everyday use and walks in the forest.",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  "rating": {
    "rate": 3.9,
    "count": 120
  }
}
```

---

#### 3. POST - Crear nuevo producto
```http
POST /products
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Nuevo Libro",
  "price": 29.99,
  "description": "Descripción del libro",
  "category": "books",
  "image": "https://example.com/image.jpg"
}
```

**Ejemplo en el proyecto:**
```javascript
async createBook(bookData) {
  try {
    const response = await fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookData)
    })
    return await response.json()
  } catch (error) {
    console.error('Error creando libro:', error)
    throw error
  }
}
```

**Uso en componente:**
```vue
<script>
methods: {
  async handleAddBook() {
    const newBook = {
      title: this.form.title,
      price: this.form.price,
      description: this.form.description,
      category: 'books',
      image: this.form.imageUrl
    }
    
    try {
      const result = await apiService.createBook(newBook)
      this.products.push(result)
      alert('Libro agregado exitosamente')
    } catch (error) {
      alert('Error al agregar libro')
    }
  }
}
</script>
```

---

#### 4. PUT - Actualizar producto
```http
PUT /products/:id
Content-Type: application/json
```

**Ejemplo:**
```javascript
async updateBook(id, bookData) {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookData)
  })
  return await response.json()
}
```

---

#### 5. DELETE - Eliminar producto
```http
DELETE /products/:id
```

**Ejemplo:**
```javascript
async deleteBook(id) {
  const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
    method: 'DELETE'
  })
  return await response.json()
}
```

---

### Integración con Firebase

Además de la API externa, el proyecto utiliza **Firebase Firestore** para persistencia de datos:

```javascript
// Guardar en Firestore después de obtener de API
import { db } from '@/firebase/config'
import { collection, addDoc } from 'firebase/firestore'

async syncApiToFirebase() {
  const apiBooks = await apiService.getBooks()
  
  for (const book of apiBooks) {
    await addDoc(collection(db, 'books'), {
      ...book,
      syncedAt: new Date()
    })
  }
}
```

---

## 📡 Comunicación entre Componentes

El proyecto implementa diversos patrones de comunicación entre componentes Vue.js:

### 1. Props (Padre → Hijo)

**Definición:** Los componentes padres pasan datos a los hijos mediante props.

**Ejemplo:**

```vue
<!-- Componente Padre: DashboardView.vue -->
<template>
  <NavbarComponent 
    :user="currentUser"
    :isLoggedIn="isAuthenticated"
    :notificationCount="notifications.length"
  />
</template>

<script>
export default {
  data() {
    return {
      currentUser: {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'admin'
      },
      isAuthenticated: true,
      notifications: [1, 2, 3]
    }
  }
}
</script>
```

```vue
<!-- Componente Hijo: NavbarComponent.vue -->
<template>
  <nav>
    <span>Bienvenido, {{ user.name }}</span>
    <span class="badge">{{ notificationCount }}</span>
  </nav>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    isLoggedIn: {
      type: Boolean,
      default: false
    },
    notificationCount: {
      type: Number,
      default: 0
    }
  }
}
</script>
```

---

### 2. Eventos (Hijo → Padre)

**Definición:** Los componentes hijos emiten eventos que los padres escuchan.

**Ejemplo:**

```vue
<!-- Componente Hijo: ProductCard.vue -->
<template>
  <div class="product-card">
    <h3>{{ product.title }}</h3>
    <button @click="handleEdit">Editar</button>
    <button @click="handleDelete">Eliminar</button>
  </div>
</template>

<script>
export default {
  props: {
    product: Object
  },
  methods: {
    handleEdit() {
      this.$emit('edit', this.product)
    },
    handleDelete() {
      this.$emit('delete', this.product.id)
    }
  }
}
</script>
```

```vue
<!-- Componente Padre: ProductsView.vue -->
<template>
  <ProductCard
    v-for="product in products"
    :key="product.id"
    :product="product"
    @edit="openEditModal"
    @delete="confirmDelete"
  />
</template>

<script>
export default {
  methods: {
    openEditModal(product) {
      this.selectedProduct = product
      this.showModal = true
    },
    confirmDelete(productId) {
      if (confirm('¿Eliminar producto?')) {
        this.deleteProduct(productId)
      }
    }
  }
}
</script>
```

---

### 3. v-model (Comunicación Bidireccional)

**Definición:** Sincronización de datos entre padre e hijo en ambas direcciones.

**Ejemplo:**

```vue
<!-- Componente Hijo: SearchBar.vue -->
<template>
  <input 
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    placeholder="Buscar..."
  />
</template>

<script>
export default {
  props: {
    modelValue: String
  },
  emits: ['update:modelValue']
}
</script>
```

```vue
<!-- Componente Padre: ProductsView.vue -->
<template>
  <SearchBar v-model="searchQuery" />
  <p>Buscando: {{ searchQuery }}</p>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: ''
    }
  }
}
</script>
```

---

### 4. Provide/Inject (Componentes Profundos)

**Definición:** Compartir datos entre componentes sin pasar por niveles intermedios.

**Ejemplo:**

```vue
<!-- App.vue (Proveedor) -->
<script>
export default {
  provide() {
    return {
      currentUser: this.user,
      theme: 'dark'
    }
  },
  data() {
    return {
      user: { name: 'Admin', role: 'admin' }
    }
  }
}
</script>
```

```vue
<!-- Cualquier componente descendiente -->
<script>
export default {
  inject: ['currentUser', 'theme'],
  mounted() {
    console.log(this.currentUser) // { name: 'Admin', role: 'admin' }
    console.log(this.theme) // 'dark'
  }
}
</script>
```

---

### 5. Event Bus (Componentes No Relacionados)

**Definición:** Comunicación entre componentes hermanos o no relacionados.

**Implementación:**

```javascript
// src/utils/eventBus.js
import { ref } from 'vue'

class EventBus {
  constructor() {
    this.events = {}
  }

  $emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }

  $on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  $off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}

export default new EventBus()
```

**Uso:**

```vue
<!-- ComponenteA.vue -->
<script>
import eventBus from '@/utils/eventBus'

export default {
  methods: {
    notifyUpdate() {
      eventBus.$emit('product-updated', { id: 1, title: 'Nuevo título' })
    }
  }
}
</script>
```

```vue
<!-- ComponenteB.vue -->
<script>
import eventBus from '@/utils/eventBus'

export default {
  mounted() {
    eventBus.$on('product-updated', this.handleProductUpdate)
  },
  beforeUnmount() {
    eventBus.$off('product-updated', this.handleProductUpdate)
  },
  methods: {
    handleProductUpdate(product) {
      console.log('Producto actualizado:', product)
    }
  }
}
</script>
```

--- 