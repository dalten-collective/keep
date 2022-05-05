import { LogMessage } from "@/types";

export default {
  namespaced: true,
  state() {
    return {
      messages: []
    };
  },

  getters: {
    agents(state): Array<string> {
      return state.agents;
    },
  },

  mutations: {
    addMessage(state, message: LogMessage) {
      state.messages.push(message);
    },
  },

  actions: {
    addMessage({ commit }, message: LogMessage) {
      commit("addMessage", message);
    },
  },
};
