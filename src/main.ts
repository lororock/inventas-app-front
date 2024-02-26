import "./assets/style.css";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";

import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import es from "./locales/es";

const app = createApp(App);
const vuetify = createVuetify({
  locale: {
    locale: "es",
    messages: { es },
    rtl: {
      customLocale: true,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
  components,
  directives,
});

const pinia = createPinia();

app.use(vuetify);
app.use(pinia);
app.use(router);
app.mount("#app");
