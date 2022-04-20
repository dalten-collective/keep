import airlock from "../api";

export default {
  namespaced: true,
  state() {
    return {
      subscription: null,
    };
  },

  mutations: {
    setSubscription(state, payload) {
      state.subscription = payload;
    },
    unsetSubscription(state) {
      state.subscription = null;
    },
  },

  actions: {
    startAirlock({ commit, dispatch }) {
      airlock.openAirlock(
        (data) => {
          console.log("data ", data);
          const agents = data.agents
          dispatch("keep/setAgents", agents, { root: true })
        },
        (sub) => {
          dispatch("setSubscription", sub);
        }
      );
    },

    setSubscription({ commit }, payload) {
      commit("setSubscription", payload);
    },

    closeAirlock({ commit, state }) {
      airlock.closeAirlock(
        state.subscription,
        commit("unsetSubscription")
      );
    },
  },
};
