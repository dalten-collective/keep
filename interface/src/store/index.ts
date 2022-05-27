import { createStore as createVuexStore } from "vuex";

import ship from "./ship";
import keep from "./keep";
import message from "./message";

export const createStore = () => {
  return createVuexStore({
    modules: {
      ship,
      keep,
      message,
    },
  });
};
