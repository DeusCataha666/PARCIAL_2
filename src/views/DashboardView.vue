<template>
  <div class="dashboard d-flex">
    <!-- Contenido principal -->
    <div class="main-content flex-grow-1">
      <NavbarComponent />
      <NexusComponent />
      <FooterComponent />
    </div>


  </div>
</template>

<script>
import NavbarComponent from "../components/NavbarComponent.vue";
import NexusComponent  from "@/components/NexusComponent.vue";
import FooterComponent from "../components/FooterComponent.vue";


export default {
  name: "DashboardView",
  components: {
    NavbarComponent,
    NexusComponent,
    FooterComponent,
  }
};
</script>

