import keepApi from "@/api";
import { Scry } from "@urbit/http-api";
import {
  PendingStatus,
  SavedStatus,
  AutoStatus,
  RestoredStatus,
  InviteStatus,
  AutoOnDiff,
  AutoOffDiff,
  ActiveDiff,
  Backup,
  PendingDiff,
  RestoreDiff,
  Diff,
  KeepAgentStatus,
  OnceRequest,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
  KeepAgentSubscriptionStatus,
  KeepSubscriptionState,
  EventType,
  LogMessage,
  BackupDiff,
} from "@/types";

export default {
  namespaced: true,
  state() {
    return {
      agents: [] as Array<string>,
      wrappedAgents: [] as Array<KeepAgentStatus>,
      backups: [] as Array<Backup>,
      pending: [] as Array,
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
      console.log("setting agents ", agents);
      state.agents = agents;
    },
    removeAgent(state, agentName: string) {
      state.agents = state.agents.filter((a: string) => a != agentName);
    },

    setAgentStatus(
      state,
      payload: {
        agentName: string;
        responseState: KeepAgentSubscriptionStatus;
      }
    ) {
      // Update or set this agent's state:
      const agentIndex = state.wrappedAgents.findIndex(
        (a: KeepAgentStatus) => a.agentName === payload.agentName
      );
      if (agentIndex == -1) {
        console.log(
          "did not find ",
          payload.agentName,
          " in wrappedAgents"
        );
        console.log("all agents ", state.agents);
        console.log("adding...");
        state.wrappedAgents.push({
          agentName: payload.agentName,
          status: payload.responseState,
        });
      } else {
        state.wrappedAgents.splice(agentIndex, 1, {
          agentName: payload.agentName,
          status: payload.responseState,
        } as KeepAgentStatus);
      }
    },

    setBackups(state, backups: Array<Backup>) {
      state.backups = backups;
    },

    addPending(state, payload: { dif: PendingDiff; agent: string }) {
      const agent = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });
      agent.status.pending.push(payload.dif);
    },
  },

  actions: {
    scry({}, scry: Scry) {
      // TODO: need to insure that path is prefixed with /
      console.log(scry);
      keepApi.scry(scry);
    },

    setAgents({ commit, dispatch }, agents: Array<string>) {
      console.log("setting agents");
      commit("setAgents", agents);
      //agents.forEach((agentName: string) => {
      //dispatch("ship/openAirlockToAgent", agentName, { root: true });
      //});
    },

    openAgentAirlocks({ commit, dispatch }, agents: Array<string>) {
      console.log("opening airlocks");
      agents.forEach((agentName: string) => {
        dispatch("ship/openAirlockToAgent", agentName, { root: true });
      });
    },

    handleKeepResponseState(
      { commit },
      responseState: KeepSubscriptionState
    ) {
      console.log("keep response state: ", responseState);
      commit("setBackups", responseState.backups);
    },

    // TODO
    handleKeepResponseType(
      {},
      payload: { diff: object; responseType: EventType }
    ) {
      console.log("keep response type: ", payload.responseType);
      console.log("keep response diff: ", payload.diff);
      if (payload.responseType == EventType.NewAgent) {
        console.log("new agent! ", payload.diff);
      }
    },
    // TODO
    handleKeepResponseDiff({}, responseDiff: object) {
      console.log("keep response diff: ", responseDiff);
    },

    handleAgentResponseState(
      { commit },
      payload: {
        agentName: string;
        responseState: KeepAgentSubscriptionStatus;
      }
    ) {
      console.log(
        `handle %${payload.agentName} agent response state: `,
        payload.responseState
      );
      commit("setAgentStatus", {
        agentName: payload.agentName,
        responseState: payload.responseState,
      });
    },
    // TODO
    handleAgentResponseType(
      { dispatch },
      payload: {
        agentName: string;
        responseType: EventType;
        diff: Diff;
      }
    ) {
      console.log("agent response type: ", payload.responseType);
      console.log("agent response diff ", payload.diff);

      if (payload.responseType === EventType.Pending) {
        const d = payload.diff as PendingDiff;
        const time = Date.now() / 1000;
        const ship = d.ship;
        const status = d.status;

        if (status === InviteStatus.Invite) {
          dispatch("addPending", { dif: d, agent: payload.agentName });

          const logMsg: LogMessage = {
            msg: `Invite pending to ${ship}`,
            time,
            type: "pend",
          };
          dispatch("message/addMessage", logMsg, { root: true });
        }
        if (status === InviteStatus.Restore) {
          // TODO: Handle this type of pending.
          const logMsg: LogMessage = {
            msg: `Waiting for restore of %${payload.agentName} from ${ship}.`,
            time,
            type: "pend",
          };
          dispatch("message/addMessage", logMsg, { root: true });
        }
      }

      if (payload.responseType === EventType.Saved) {
        const d = payload.diff as BackupDiff;
        const time = d.time;
        const ship = d.ship;
        const logMsg: LogMessage = {
          msg: `Backed up %${payload.agentName} to ${ship} at ${time}`,
          time,
          type: "succ",
        };
        dispatch("message/addMessage", logMsg, { root: true });
      }

      if (payload.responseType === EventType.Restored) {
        const d = payload.diff as RestoreDiff;
        const time = d.time;
        const ship = d.ship;
        const logMsg: LogMessage = {
          msg: `Restored %${payload.agentName} from ${ship} at ${time}`,
          time,
          type: "succ",
        };
        dispatch("message/addMessage", logMsg, { root: true });
      }

      if (payload.responseType === EventType.Auto) {
        if (
          Object.prototype.hasOwnProperty.call(payload.diff, "freq") &&
          payload.diff.freq
        ) {
          const d = payload.diff as AutoOnDiff;
          const freq = d.freq;
          const ship = d.ship;
          const time = Date.now() / 1000;
          const logMsg: LogMessage = {
            msg: `Recurring backups for %${payload.agentName} to ${ship} activated every ${freq} seconds`,
            time,
            type: "info",
          };
          dispatch("message/addMessage", logMsg, { root: true });
        } else {
          const d = payload.diff as AutoOffDiff;
          const time = Date.now() / 1000;
          const ship = d.ship;
          const logMsg: LogMessage = {
            msg: `Recurring backups for %${payload.agentName} to ${ship} stopped`,
            time,
            type: "info",
          };
          dispatch("message/addMessage", logMsg, { root: true });
        }
      }

      if (payload.responseType === EventType.Active) {
        const active = payload.diff as ActiveDiff;
        const agent = payload.agentName;
        if (active) {
          const time = Date.now() / 1000;
          const logMsg: LogMessage = {
            msg: `${agent} activated!`,
            time,
            type: "succ",
          };
          dispatch("message/addMessage", logMsg, { root: true });
        } else {
          const time = Date.now() / 1000;
          const logMsg: LogMessage = {
            msg: `${agent} deactivated!`,
            time,
            type: "info",
          };
          dispatch("message/addMessage", logMsg, { root: true });
        }
      }
    },

    removeAgent({ commit }, agentName: string) {
      commit("removeAgent", agentName);
    },

    testOnce({}, payload: OnceRequest) {
      return keepApi
        .testOnce(payload)
        .then((r) => {
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
    },
    testMany({}, payload: ManyRequest) {
      keepApi.testMany(payload);
    },
    testUnsetMany({}, payload: UnsetManyRequest) {
      keepApi.testUnsetMany(payload);
    },
    testRestore({}, payload: RestoreRequest) {
      keepApi.testRestore(payload);
    },
    mendFromShip({}, payload: RestoreRequest) {
      keepApi.mendFromShip(payload)(payload);
    },
    activate({}, payload: { agentName: string }) {
      keepApi.activate(payload.agentName);
    },
    deactivate({}, payload: { agentName: string }) {
      keepApi.deactivate(payload.agentName);
    },

    addPending(
      { commit },
      payload: { dif: PendingDiff; agent: string }
    ) {
      commit("addPending", payload);
    },
  },
};
