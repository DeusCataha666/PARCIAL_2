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
    name: "Dashboard",
    component: DashboardView 
    // Página pública, accesible sin login
  },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/registro", name: "Register", component: RegisterView },
  { 
    path: "/productos", 
    name: "ProductsView", 
    component: ProductsView, 
    meta: { requiresAuth: true } 
  },
  { 
    path: "/admin", 
    name: "AdminPanel", 
    component: AdminPanelView, 
    meta: { requiresAuth: true, requiresAdmin: true } 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protección global de rutas
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  const isAdmin = user && user.email === "admin@nexuslibrary.com";

  // Si va al login y ya está autenticado
  if (to.path === "/login" && user) {
    if (isAdmin) {
      next("/admin");
    } else {
      next("/productos");
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

  // Si va a la ruta principal "/" y hay un usuario autenticado
  if (to.path === "/" && user) {
    if (isAdmin) {
      next("/admin");
    } else {
      next("/productos");
    }
    return;
  }

  // En cualquier otro caso, continuar normalmente
  next();
});

export default router;
