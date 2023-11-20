import { createApp } from "vue";
import "./assets/style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
});

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(vuetify);
app.mount("#app");
