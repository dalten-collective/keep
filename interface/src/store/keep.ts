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
        return a.status.active === true;
      });
    },
    inactiveAgents(state): Array<KeepAgentStatus> {
      return state.wrappedAgents.filter((a) => {
        return a.status.active === false;
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

    setAgentStatus(state, payload: { agentName: string }) {
      const existingAgent: KeepAgentStatus = state.wrappedAgents.find(
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
            restored: [],
            active: false,
          },
        };
        state.wrappedAgents.push(agentStatus);
      }
    },

    setPendingOnAgent(
      state,
      payload: { agentName: string; pending: Array<PendingStatus> }
    ) {
      const existingAgent: KeepAgentStatus = state.wrappedAgents.find(
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
      const existingAgent: KeepAgentStatus = state.wrappedAgents.find(
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
      const existingAgent: KeepAgentStatus = state.wrappedAgents.find(
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

    setRestoredOnAgent(
      state,
      payload: { agentName: string; restored: Array<RestoredStatus> }
    ) {
      const existingAgent: KeepAgentStatus = state.wrappedAgents.find(
        (a) => a.agentName === payload.agentName
      );
      if (existingAgent) {
        // if already present in activeAgents, just update this key
        existingAgent.status.restored = existingAgent.status.restored.concat(
          payload.restored
        );
      } else {
        // TODO: can this even happen?
      }
    },

    setActiveOnAgent(state, payload: { agentName: string; active: boolean }) {
      const existingAgent: KeepAgentStatus = state.wrappedAgents.find(
        (a) => a.agentName === payload.agentName
      );
      if (existingAgent) {
        // if already present in activeAgents, just update this key
        existingAgent.status.active = payload.active;
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
