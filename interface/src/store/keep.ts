import keepApi from "../api/keep";

export default {
  namespaced: true,
  state() {
    return {
      agents: [],
    };
  },

  getters: {
    agents(state) {
      return state.agents;
    },
  },

  mutations: {
    setAgents(state, agents: Array<any>) {
      state.agents = agents;
    },
  },

  actions: {
    setAgents({ commit }, agents: Array<any>) {
      commit("setAgents", agents);
    },

    testBackup(payload: { agentName: string} ) {
      keepApi.testBackup(payload.agentName);
    },
    testRestore(payload: { agentName: string }) {
      keepApi.testRestore(payload.agentName);
    },
  },
};
