import airlock from "../api";

import { AgentSubscription, KeepAgentSubscriptionStatus } from "@/types";

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

    openAirlockToAgent({ dispatch, commit }, agentName: string) {
      airlock.openAirlockTo(
        agentName,
        (data: KeepAgentSubscriptionStatus) => {
          // set up default if not present
          commit("keep/setAgentStatus", { agentName }, { root: true });

          // DEBUG:
          console.log("data ", data);
          if (Object.prototype.hasOwnProperty.call(data, "pending")) {
            const pending = data.pending;
            // TODO: make these actions.
            commit(
              "keep/setPendingOnAgent",
              { agentName, pending },
              { root: true }
            );
          }

          if (Object.prototype.hasOwnProperty.call(data, "saved")) {
            const saved = data.saved;
            commit(
              "keep/setSavedOnAgent",
              { agentName, saved },
              { root: true }
            );
          }

          if (Object.prototype.hasOwnProperty.call(data, "saved")) {
            const auto = data.auto;
            commit("keep/setAutoOnAgent", { agentName, auto }, { root: true });
          }
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

    addSubscription(
      { state, commit, dispatch },
      payload: AgentSubscription
    ) {
      const existing:
        | Array<AgentSubscription>
        | [] = state.subscriptions.filter((s: AgentSubscription) => {
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
