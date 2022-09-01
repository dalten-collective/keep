import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

const app = createApp(App);

app.config.globalProperties.$filters = {
  sigShip(ship) {
    if (ship[0] === "~") {
      return ship;
    }
    return `~${ship}`;
  },
};

app.use(router).use(store).use(vuetify).mount("#app");
