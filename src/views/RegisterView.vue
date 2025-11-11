<template>
  <div class="register-container d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow p-4" style="width: 24rem;">
      <h3 class="text-center mb-4">Crear cuenta</h3>

      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="nombre" class="form-label">Nombre completo</label>
          <input
            v-model="nombre"
            type="text"
            class="form-control"
            id="nombre"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            placeholder="correo@ejemplo.com"
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
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div v-if="error" class="alert alert-danger py-2 text-center">
          {{ error }}
        </div>
        <div v-if="success" class="alert alert-success py-2 text-center">
          {{ success }}
        </div>

        <button type="submit" class="btn btn-success w-100">Registrarse</button>

        <p class="text-center mt-3">
          ¿Ya tienes cuenta?
          <router-link to="/login">Inicia sesión aquí</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";

export default {
  name: "RegisterView",
  data() {
    return {
      nombre: "",
      email: "",
      password: "",
      error: "",
      success: "",
    };
  },
  methods: {
    async register() {
      this.error = "";
      this.success = "";
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.email,
          this.password
        );

        // Guarda el nombre del usuario en su perfil de Firebase
        await updateProfile(userCredential.user, {
          displayName: this.nombre,
        });

        this.success = "Usuario registrado correctamente.";
        this.nombre = "";
        this.email = "";
        this.password = "";

        // Redirigir al login después de unos segundos
        setTimeout(() => this.$router.push("/login"), 1500);
      } catch (err) {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
          this.error = "El correo ya está registrado.";
        } else if (err.code === "auth/weak-password") {
          this.error = "La contraseña debe tener al menos 6 caracteres.";
        } else {
          this.error = "Error al registrar el usuario.";
        }
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
}
.card {
  border-radius: 15px;
}
</style>
