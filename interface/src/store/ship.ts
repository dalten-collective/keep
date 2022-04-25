import airlock from "../api";

interface AgentSubscription {
  agentName: string;
  subscriptionNumber: number;
}

export default {
  namespaced: true,
  state() {
    return {
      subscriptions: [] as Array<AgentSubscription>,
    };
  },

  getters: {
    keepSubscription(state): AgentSubscription | null {
      const keepSub: AgentSubscription = state.subscriptions.find(
        (sub) => sub.agentName === "keep"
      );
      if (keepSub) {
        return keepSub;
      }
      return null;
    },
    agentSubscriptions(state): Array<AgentSubscription> | [] {
      return state.subscriptions.filter((sub) => {
        return sub.agentName != "keep";
      });
    },
  },

  mutations: {
    addSubscription(state, payload: AgentSubscription) {
      state.subscriptions.push(payload);
    },

    unsetSubscription(state, subscription: AgentSubscription) {
      const sub = state.subscriptions.find((s) => s === subscription);
      state.subscriptions = state.subscriptions.filter((s) => s != sub);
    },
  },

  actions: {
    openKeepAirlock({ dispatch }) {
      airlock.openKeepAirlock(
        (data) => {
          console.log("data ", data);
          const agents = data.agents;
          dispatch("keep/setAgents", agents, { root: true });
        },
        (subscriptionNumber: number) => {
          // TODO: this should be close, I think.
          dispatch("addSubscription", {
            agentName: "keep",
            subscriptionNumber,
          } as AgentSubscription);
        }
      );
    },

    openAirlockToAgent({ dispatch }, agentName: string) {
      airlock.openAirlockTo(
        agentName,
        (data) => {
          console.log("data ", data);
        },
        (subscriptionNumber: number) => {
          dispatch("addSubscription", {
            agentName,
            subscriptionNumber,
          } as AgentSubscription);
        }
      );
    },

    removeSubscription({ commit }, subscription: AgentSubscription) {
      commit("unsetSubscription", subscription);
    },

    addSubscription({ state, commit, dispatch }, payload: AgentSubscription) {
      const existing: Array<AgentSubscription> | [] =
        state.subscriptions.filter((s: AgentSubscription) => {
          return s.agentName === payload.agentName;
        });
      existing.forEach((sub) => {
        dispatch("removeSubscription", sub);
      });
      commit("addSubscription", payload);
    },

    closeKeepAirlock({ commit, getters }) {
      const keepSubscription: AgentSubscription | null =
        getters.keepSubscription;
      if (keepSubscription) {
        airlock.closeAirlock(
          keepSubscription.subscriptionNumber,
          commit("unsetSubscription", keepSubscription)
        );
      } else {
        console.log("No active keep subscription");
      }
    },

    closeAgentAirlocks({ commit, dispatch, getters }) {
      const agentSubscriptions: Array<AgentSubscription> | [] =
        getters.agentSubscriptions;
      agentSubscriptions.forEach((sub) => {
        airlock.closeAirlock(sub.subscriptionNumber, [
          commit("unsetSubscription", sub),
          dispatch("keep/removeAgent", sub.agentName, { root: true }),
        ]);
      });
    },
  },
};
