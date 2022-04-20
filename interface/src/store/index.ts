import { createStore as createVuexStore } from "vuex";

import ship from "./ship";
import keep from "./keep";

export const createStore = () => {
  return createVuexStore({
    modules: {
      ship,
      keep,
    },
  });
};
