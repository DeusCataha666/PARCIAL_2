import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './assets/estilosCss/navbar.css';
import './assets/estilosCss/footer.css';
import './assets/estilosCss/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';

import { getAuth, onAuthStateChanged } from "firebase/auth";

const auth = getAuth();
const app = createApp(App);

let appMounted = false;

onAuthStateChanged(auth, (user) => {
  if (!appMounted) {
    app.use(router).mount("#app");
    appMounted = true;
  }

  if (user) {
    if (user.email === "admin@nexuslibrary.com") {
      router.push("/admin");
    } else {
      router.push("/productos");
    }
  } else {
    if (router.currentRoute.value.path !== "/") {
      router.push("/");
    }
  }
});
