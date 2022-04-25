import keepApi from "../api/keep";

export default {
  namespaced: true,
  state() {
    return {
      agents: [] as Array<string>,
    };
  },

  getters: {
    agents(state): Array<string> {
      return state.agents;
    },
  },

  mutations: {
    setAgents(state, agents: Array<string>) {
      state.agents = agents;
    },
    removeAgent(state, agentName: string) {
      state.agents = state.agents.filter((a: string) => a != agentName);
    },
  },

  actions: {
    setAgents({ commit, dispatch }, agents: Array<string>) {
      commit("setAgents", agents);
      agents.forEach((agentName: string) => {
        dispatch("ship/openAirlockToAgent", agentName, { root: true });
      });
    },

    removeAgent({ commit }, agentName: string) {
      commit("removeAgent", agentName);
    },

    testBackup(payload: { agentName: string }) {
      keepApi.testBackup(payload.agentName);
    },
    testRestore(payload: { agentName: string }) {
      keepApi.testRestore(payload.agentName);
    },
    activate(payload: { agentName: string }) {
      console.log(payload);
      keepApi.activate(payload.agentName);
    },
  },
};
