import keepApi from "../api/keep";
import { Scry } from "@urbit/http-api";
import {
  PendingStatus,
  SavedStatus,
  AutoStatus,
  KeepAgentStatus,
} from "@/types";

export default {
  namespaced: true,
  state() {
    return {
      agents: [] as Array<string>,
      activeAgents: [] as Array<KeepAgentStatus>,
    };
  },

  getters: {
    agents(state): Array<string> {
      return state.agents;
    },
    agentStatus: (state) => (agentName: string) => {
      return state.activeAgents.find((sub: KeepAgentStatus) => {
        return sub.agentName == agentName;
      });
    },
  },

  mutations: {
    setAgents(state, agents: Array<string>) {
      state.agents = agents;
    },
    removeAgent(state, agentName: string) {
      state.agents = state.agents.filter((a: string) => a != agentName);
    },

    setAgentStatus(state, payload: { agentName: string }) {
      const existingAgent: KeepAgentStatus = state.activeAgents.find(
        (a) => a.agentName === payload.agentName
      );
      // Only set this empty status if we don't already have this agent.
      if (!existingAgent) {
        const agentStatus: KeepAgentStatus = {
          agentName: payload.agentName,
          status: {
            pending: [],
            auto: [],
            saved: [],
          },
        };
        state.activeAgents.push(agentStatus);
      }
    },

    setPendingOnAgent(
      state,
      payload: { agentName: string; pending: Array<PendingStatus> }
    ) {
      const existingAgent: KeepAgentStatus = state.activeAgents.find(
        (a) => a.agentName === payload.agentName
      );
      if (existingAgent) {
        // if already present in activeAgents, just update this key
        existingAgent.status.pending = existingAgent.status.pending.concat(
          payload.pending
        );
        // TODO: this concat pattern isn't great - sometimes the wire returns
        // a duplicate entry. Say you already have a pending invite out to ~wet,
        // if you try to back up to ~wet again, you'll get another
        // { status: "invite", ship: "wet" }, and it'll concat to the list as a dupe.
        // Either handle this on the backend or:
        // - use a set here to avoid dupes
        // - don't even allow backing up to a ship name that is already in your
        //   pending list
      } else {
        // TODO: can this even happen?
      }
    },

    setSavedOnAgent(
      state,
      payload: { agentName: string; saved: Array<SavedStatus> }
    ) {
      const existingAgent: KeepAgentStatus = state.activeAgents.find(
        (a) => a.agentName === payload.agentName
      );
      if (existingAgent) {
        // if already present in activeAgents, just update this key
        existingAgent.status.saved = existingAgent.status.saved.concat(
          payload.saved
        );
      } else {
        // TODO: can this even happen?
      }
    },

    setAutoOnAgent(
      state,
      payload: { agentName: string; auto: Array<AutoStatus> }
    ) {
      const existingAgent: KeepAgentStatus = state.activeAgents.find(
        (a) => a.agentName === payload.agentName
      );
      if (existingAgent) {
        // if already present in activeAgents, just update this key
        existingAgent.status.auto = existingAgent.status.auto.concat(
          payload.auto
        );
      } else {
        // TODO: can this even happen?
      }
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

    removeAgent({ commit }, agentName: string) {
      commit("removeAgent", agentName);
    },

    testBackup({}, payload: { agentName: string; ship: string }) {
      // TODO: make sure ship name is prefixed with ~
      keepApi.testBackup({ agentName: payload.agentName, ship: payload.ship });
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
