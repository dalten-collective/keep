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
    setMessages(state, payload) {
      state.messages = payload;
    },
    removeMessage(state, message: LogMessage) {
      state.messages = state.messages.filter((m: LogMessage) => {
        return m.time !== message.time;
      })
    },
  },

  actions: {
    addMessage({ commit }, message: LogMessage) {
      commit("addMessage", message);
    },
    clearMessages({ commit }) {
      commit('setMessages', [])
    },
    clearMessage({ commit }, message: LogMessage) {
      commit('removeMessage', message)
      // commit('setMessages', [])
    },
  },
};
