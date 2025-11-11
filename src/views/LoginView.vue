<template>
  <div class="login-container d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow p-4" style="width: 22rem;">
      <h3 class="text-center mb-4">Iniciar Sesión</h3>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            placeholder="Ingrese su correo"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger py-2 text-center">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary w-100">Entrar</button>

        <p class="text-center mt-3">
          ¿No tienes cuenta?
          <router-link to="/registro">Regístrate aquí</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async login() {
      this.error = "";
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        localStorage.setItem("usuarioActivo", this.email);
        this.$router.push("/productos");
      } catch (err) {
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
          this.error = "Correo o contraseña incorrectos";
        } else {
          this.error = "Error al iniciar sesión";
        }
        console.error(err);
      }
    },
  },
};
</script>

