import { createStore } from "vuex";

import ship from "./ship";
import keep from "./keep";
import message from "./message";

const store = createStore({
  modules: {
    ship,
    keep,
    message,
  },
});

export default store;
