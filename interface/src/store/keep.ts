import keepApi from "@/api";
import { Scry } from "@urbit/http-api";
import {
  PendingStatus,
  SavedStatus,
  AutoStatus,
  RestoredStatus,
  InviteStatus,
  AutoOnDiff,
  BackupDiff,
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
  SavedDiff,
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

    updateBackup(state, payload: { dif: BackupDiff; agent: string }) {
      // remove if existing (by agent AND ship)
      state.backups = state.backups.filter((b) => {
        if (b.ship != payload.dif.ship || b.agent != payload.agent) {
          return b
        }
      })
      // add
      state.backups.push(payload.dif);
    },

    addPending(state, payload: { dif: PendingDiff; agent: string }) {
      const agent = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });
      agent.status.pending.push(payload.dif);
    },

    updateSaved(state, payload: { dif: SavedDiff; agent: string }) {
      const agent = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });

      // remove if existing
      if (
        agent.status.saved.map((s) => s.ship).includes(payload.dif.ship)
      ) {
        agent.status.saved = agent.status.saved.filter((s) => {
          return s.ship !== payload.dif.ship;
        });
      }
      // add new status to saved
      agent.status.saved.push(payload.dif);
    },

    updateAuto(state, payload: { dif: AutoOnDiff; agent: string }) {
      const agent: KeepAgentStatus = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });

      // remove if existing
      if (
        agent.status.auto.map((s) => s.ship).includes(payload.dif.ship)
      ) {
        agent.status.auto = agent.status.auto.filter((s) => {
          return s.ship !== payload.dif.ship;
        });
      }
      // add new status to auto
      agent.status.auto.push(payload.dif);
    },

    removeAuto(state, payload: { dif: AutoOffDiff; agent: string }) {
      const agent: KeepAgentStatus = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });

      // remove if existing
      if (
        agent.status.auto.map((s) => s.ship).includes(payload.dif.ship)
      ) {
        agent.status.auto = agent.status.auto.filter((s) => {
          return s.ship !== payload.dif.ship;
        });
      }
    },

    addActive(state, payload: { dif: ActiveDiff; agent: string }) {
      const agent: KeepAgentStatus = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });

      if (!agent.status.live) {
        agent.status.live = true;
      }
    },

    removeActive(state, payload: { dif: ActiveDiff; agent: string }) {
      const agent: KeepAgentStatus = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });

      if (agent.status.live) {
        agent.status.live = false;
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

    handleKeepResponseDiff(
      { dispatch },
      payload: {
        agentName: string;
        responseType: EventType;
        diff: Diff;
      }
    ) {
      if (payload.responseType === EventType.Backup) {
        const d = payload.diff as BackupDiff;
        const time = d.time;
        const ship = d.ship;
        const agent = d.agent;

        dispatch("addKeptBackup", { dif: d, agent });

        const logMsg: LogMessage = {
          msg: `Kept a backup of %${agent} for ${ship} at ${time}`,
          time,
          type: "info",
        };
        dispatch("message/addMessage", logMsg, { root: true });
      }
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

    // For handling diffs
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
        const d = payload.diff as SavedDiff;
        const time = d.time;
        const ship = d.ship;

        dispatch("addSavedBackup", {
          dif: d,
          agent: payload.agentName,
        });

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

        // TODO: handle as dif?

        // TODO: also remove from pending.

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

          dispatch("addAuto", { dif: d, agent: payload.agentName });

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

          dispatch("removeAuto", { dif: d, agent: payload.agentName });

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

          dispatch("addActive", {
            dif: active,
            agent: payload.agentName,
          });

          const logMsg: LogMessage = {
            msg: `${agent} activated!`,
            time,
            type: "succ",
          };
          dispatch("message/addMessage", logMsg, { root: true });
        } else {
          const time = Date.now() / 1000;

          dispatch("removeActive", {
            dif: active,
            agent: payload.agentName,
          });

          const logMsg: LogMessage = {
            msg: `${agent} deactivated!`,
            time,
            type: "fail",
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
      return keepApi
        .testMany(payload)
        .then((r) => {
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
    },

    testUnsetMany({}, payload: UnsetManyRequest) {
      return keepApi
        .testUnsetMany(payload)
        .then((r) => {
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
    },

    testRestore({}, payload: RestoreRequest) {
      return keepApi
        .testRestore(payload)
        .then((r) => {
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
    },

    mendFromShip({}, payload: RestoreRequest) {
      return keepApi
        .mendFromShip(payload)
        .then((r) => {
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
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

    addKeptBackup(
      { commit },
      payload: { dif: BackupDiff; agent: string }
    ) {
      commit("updateBackup", payload);
    },

    addSavedBackup(
      { commit },
      payload: { dif: SavedDiff; agent: string }
    ) {
      commit("updateSaved", payload);
    },

    addAuto({ commit }, payload: { dif: AutoOnDiff; agent: string }) {
      commit("updateAuto", payload);
    },

    removeAuto(
      { commit },
      payload: { dif: AutoOffDiff; agent: string }
    ) {
      commit("removeAuto", payload);
    },

    addActive({ commit }, payload: { dif: ActiveDiff; agent: string }) {
      commit("addActive", payload);
    },

    removeActive(
      { commit },
      payload: { dif: ActiveDiff; agent: string }
    ) {
      commit("removeActive", payload);
    },
  },
};
