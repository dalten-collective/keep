import keepApi from "../api/keep";
import { Scry } from "@urbit/http-api";
import {
  PendingStatus,
  SavedStatus,
  AutoStatus,
  RestoredStatus,
  KeepAgentStatus,
  OnceRequest,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
  KeepAgentSubscriptionStatus,
  KeepSubscriptionState,
  EventType,
} from "@/types";

export default {
  namespaced: true,
  state() {
    return {
      agents: [] as Array<string>,
      wrappedAgents: [] as Array<KeepAgentStatus>,
    };
  },

  getters: {
    agents(state): Array<string> {
      return state.agents;
    },
    activeAgents(state): Array<KeepAgentStatus> {
      return state.wrappedAgents.filter((a) => {
        return a.status.live === true;
      });
    },
    inactiveAgents(state): Array<KeepAgentStatus> {
      return state.wrappedAgents.filter((a) => {
        return a.status.live === false;
      });
    },
    agentStatus: (state) => (
      agentName: string
    ): KeepAgentSubscriptionStatus | null => {
      const s = state.wrappedAgents.find((sub: KeepAgentStatus) => {
        return sub.agentName == agentName;
      });
      if (s) {
        return s.status;
      }
      return null;
    },
  },

  mutations: {
    setAgents(state, agents: Array<string>) {
      state.agents = agents;
    },
    removeAgent(state, agentName: string) {
      state.agents = state.agents.filter((a: string) => a != agentName);
    },

    setAgentStatus(
      state,
      payload: { agentName: string; responseState: KeepAgentSubscriptionStatus }
    ) {
      // Update or set this agent's state:
      const agentIndex = state.wrappedAgents.findIndex(
        (a: KeepAgentStatus) => a.agentName === payload.agentName
      );
      state.wrappedAgents.splice(agentIndex, 1, {
        agentName: payload.agentName,
        status: payload.responseState,
      } as KeepAgentStatus);
    },
  },

  actions: {
    scry({}, scry: Scry) {
      // TODO: need to insure that path is prefixed with /
      console.log(scry);
      keepApi.scry(scry);
    },

    setAgents({ commit, dispatch }, agents: Array<string>) {
      commit("setAgents", agents);
      agents.forEach((agentName: string) => {
        dispatch("ship/openAirlockToAgent", agentName, { root: true });
      });
    },

    handleKeepResponseState({}, responseState: KeepSubscriptionState) {
      console.log("keep response state: ", responseState);
    },
    // TODO
    handleKeepResponseType({}, responseType: EventType) {
      console.log("keep response type: ", responseType);
    },
    // TODO
    handleKeepResponseDiff({}, responseDiff: object) {
      console.log("keep response diff: ", responseDiff);
    },

    handleAgentResponseState(
      { commit },
      payload: { agentName: string; responseState: KeepAgentSubscriptionStatus }
    ) {
      console.log("agent response state: ", payload.responseState);
      commit("setAgentStatus", {
        agentName: payload.agentName,
        responseState: payload.responseState,
      });
    },
    // TODO
    handleAgentResponseType({}, responseType: EventType) {
      console.log("agent response type: ", responseType);
    },
    // TODO
    handleAgentResponseDiff({}, responseDiff: object) {
      console.log("agent response diff: ", responseDiff);
    },

    removeAgent({ commit }, agentName: string) {
      commit("removeAgent", agentName);
    },

    testOnce({}, payload: OnceRequest) {
      // TODO: make sure ship name is prefixed with ~
      keepApi.testOnce(payload);
    },
    testMany({}, payload: ManyRequest) {
      // TODO: make sure ship name is prefixed with ~
      keepApi.testMany(payload);
    },
    testUnsetMany({}, payload: UnsetManyRequest) {
      // TODO: make sure ship name is prefixed with ~
      keepApi.testUnsetMany(payload);
    },
    testRestore({}, payload: RestoreRequest) {
      keepApi.testRestore(payload);
    },
    activate({}, payload: { agentName: string }) {
      keepApi.activate(payload.agentName);
    },
    deactivate({}, payload: { agentName: string }) {
      keepApi.deactivate(payload.agentName);
    },
  },
};
