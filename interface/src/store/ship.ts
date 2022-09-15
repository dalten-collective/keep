import airlock from "../api";

import {
  AgentSubscription,
  KeepAgentSubscriptionResponse,
  KeepSubscriptionResponse,
  EventType,
} from "@/types";

export default {
  namespaced: true,
  state() {
    return {
      subscriptions: [] as Array<AgentSubscription>,
      installedDesks: ['hi', 'world'] as Array<string>,
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

    setDesks(state, desks: Array<string>) {
      state.installedDesks = desks;
    },

    unsetSubscription(state, subscription: AgentSubscription) {
      const sub = state.subscriptions.find((s) => s === subscription);
      state.subscriptions = state.subscriptions.filter((s) => s != sub);
    },
  },

  actions: {
    setDesks({ commit }, desks: Array<string>) {
      commit('setDesks', desks)
    },

    openKeepAirlock({ dispatch }) {
      console.log("opening to keep...");
      airlock.openKeepAirlock(
        (data: KeepSubscriptionResponse) => {
          console.log("keep data ", data);

          if (data.type === EventType.Initial) {
            const agents = data.state.agents;
            dispatch("keep/setAgents", agents, { root: true }).then(
              () => {
                dispatch("keep/openAgentAirlocks", agents, {
                  root: true,
                });
              }
            );
          }
          // TODO: handle "active" when a new wrapper comes online
          // TODO: what other types are there for the main Keep subscription?

          dispatch("keep/handleKeepResponseState", data.state, {
            root: true,
          });
          // TODO:
          //dispatch("keep/handleKeepResponseType", data.type, { root: true });
          // TODO:
          dispatch(
            "keep/handleKeepResponseDiff",
            { diff: data.diff, responseType: data.type },
            { root: true }
          );
        },
        (subscriptionNumber: number) => {
          console.log("keep sub: ", subscriptionNumber);
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
        (data: KeepAgentSubscriptionResponse) => {
          console.log("agentName ", agentName);
          console.log(
            `sub-agent response ('${agentName}' agent)`,
            data
          );

          // Only set full state on initial. all else through diffs (below)
          if (data.type == "initial") {
            dispatch(
              "keep/handleAgentResponseState",
              { agentName, responseState: data.state },
              { root: true }
            );
          }

          dispatch(
            "keep/handleAgentResponseType",
            { agentName, responseType: data.type, diff: data.diff },
            { root: true }
          );
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
