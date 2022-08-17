import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './index.css'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

// import { createStore } from "./store";

// const app = createApp(App);
// const store = createStore(app);

loadFonts()

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app')
