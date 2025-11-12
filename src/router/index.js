import { createRouter, createWebHistory } from "vue-router";
import { auth } from "../firebase/config";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import ProductsView from "../views/ProductsView.vue";
import AdminPanelView from "../views/AdminPanelView.vue";

const routes = [
  { 
    path: "/", 
    component: DashboardView 
    // Sin meta: requiresAuth para que sea accesible para todos
  },
  { path: "/login", component: LoginView },
  { path: "/registro", component: RegisterView },
  { 
    path: "/productos", 
    component: ProductsView, 
    meta: { requiresAuth: true } 
  },
  { 
    path: "/admin", 
    component: AdminPanelView, 
    meta: { 
      requiresAuth: true,
      requiresAdmin: true 
    } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección global de rutas
router.beforeEach(async (to, from, next) => {
  const user = auth.currentUser;
  
  // Verificar si el usuario es admin
  const isAdmin = user && user.email === "admin@nexuslibrary.com";

  // Si va al login y ya está autenticado
  if (to.path === '/login' && user) {
    if (isAdmin) {
      next('/admin');
    } else {
      next('/productos');
    }
    return;
  }

  // Si la ruta requiere autenticación y no hay usuario
  if (to.meta.requiresAuth && !user) {
    next("/login");
    return;
  }

  // Si la ruta requiere privilegios de admin
  if (to.meta.requiresAdmin) {
    if (!user) {
      next("/login");
    } else if (!isAdmin) {
      next("/productos");
    } else {
      next();
    }
    return;
  }

  // Si va a la ruta principal y es admin
  if (to.path === '/' && isAdmin) {
    next('/admin');
    return;
  }

  next();
});




export default router;
