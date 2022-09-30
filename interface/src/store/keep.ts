import keepApi from "@/api";
import { Scry } from "@urbit/http-api";
import {
  PendingStatus,
  SavedStatus,
  AutoStatus,
  RestoredStatus,
  Ship,
  InviteStatus,
  AgentDiff,
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
  KeepAgentState,
  KeepWrapperState,
  EventType,
  LogMessage,
  SavedDiff,
  WhitelistSettings,
  LocalBackupRequest,
  LocalManyRequest,
  SuccessDiff,
  CopyDepsPayload,
  AgentName,
  DeskName,
  KeepWrapperSubscriptionResponse,
  KeepWrapperSavedResponse,
  WrapperState,
  KeepAgentSubscriptionResponse,
} from "@/types";
import { siggedShip } from "@/api/keep";

export default {
  namespaced: true,
  state() {
    return {
      agents: [] as Array<AgentName>,
      auto: [] as Array<AutoStatus>,
      backups: [] as Array<Backup>,
      desks: [] as Array<DeskName>,
      saved: [] as Array<SavedStatus>,
      whitelist: {} as WhitelistSettings,
      wrappers: {}, // keys: agents names, values: KeepWrapperState
      wrappedAgents: [] as Array<KeepAgentStatus>, // TODO: remove
      copyingDepsAgents: [] as Array<string>, // TODO: remove
      pending: [] as Array<PendingStatus>, // TODO: remove
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

    wrapperStatus: (state) => ( soughtAgentName: AgentName): KeepWrapperState | null => {
      const pending: Array<PendingStatus> | [] = []
      return {
        pending
      };
    },

    agentStatus: (state: KeepAgentState) => (soughtAgentName: AgentName) => {
      console.log(state)
      const auto: Array<AutoStatus> | [] = state.auto.filter((a: AutoStatus) => {
        return a.agent === soughtAgentName
      })
      const backup: Array<Backup> | [] = state.backups.filter((b: Backup) => {
        return b.agent === soughtAgentName
      })
      const saved: Array<SavedStatus> | [] = state.saved.filter((s: SavedStatus) => {
        return s.agent === soughtAgentName
      })
      return {
        auto, backup, saved
      };
    },
  },

  mutations: {
    setDesks(state, desks) {
      state.desks = desks;
    },

    localOnWyte(state) {
      state.whitelist.on = true;
    },
    localOffWyte(state) {
      state.whitelist.on = false;
    },

    addToWyte(state, ship) {
      const list = new Set(state.whitelist.in);
      list.add(ship);
      state.whitelist.in = Array.from(list);
      // state.whitelist.in.push(ship);
    },
    removeFromWyte(state, ship) {
      state.whitelist.in = state.whitelist.in.filter((s) => {
        return siggedShip(s) !== siggedShip(ship);
      });
    },

    setAgents(state, agents: Array<string>) {
      console.log("setting agents ", agents);
      state.agents = agents;
    },
    removeAgent(state, agentName: string) {
      state.agents = state.agents.filter((a: string) => a != agentName);
    },

    setWrapperStatus(
      state,
      payload: {
        agentName: string;
        state: KeepWrapperState;
      }
    ) {
      console.log('setWrapperStatus...: ', payload)
      state.wrappers[payload.agentName] = payload.state
    },

    setAuto(state, auto: Array<AutoStatus>) {
      state.auto = auto;
    },
    setBackups(state, backups: Array<Backup>) {
      state.backups = backups;
    },
    setSaved(state, saved: Array<SavedStatus>) {
      state.saved = saved;
    },

    setWhitelist(state, whitelist: WhitelistSettings) {
      state.whitelist = whitelist;
    },

    updateBackup(state, payload: { dif: BackupDiff; agent: string }) {
      // remove if existing (by agent AND ship)
      state.backups = state.backups.filter((b) => {
        if (b.ship != payload.dif.ship || b.agent != payload.agent) {
          return b;
        }
      });
      // add
      state.backups.push(payload.dif);
    },

    addPending(state, payload: { dif: PendingDiff; agent: string }) {
      const agent = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });
      agent.status.pending.push(payload.dif);
    },

    // TODO: I AM THE MODEL
    updateSaved(state, payload: { agentName: AgentName; diff: SavedStatus; state: KeepWrapperState }) {
      // remove if existing
      if (state.saved.map((s: SavedStatus) => s.agent).includes(payload.agentName)) {
        state.saved = state.saved.filter((s: SavedStatus) => {
          return !(s.agent === payload.agentName && s.ship === payload.diff.ship);
        });
      }
      // add new status to saved
      const savedState = {
        agent: payload.agentName,
        ship: payload.diff.ship,
        time: payload.diff.time,
      }
      state.saved.push(savedState);

      // update state.wrappers
      state.wrappers[payload.agentName] = payload.state;
    },

    updateBackups(state, payload: { diff: BackupDiff; state: KeepAgentState; }) {
      // remove if existing
      console.log('remove backups', payload)
      if (state.backups.map((b: Backup) => b.agent).includes(payload.diff.agent)) {
        state.backups = state.backups.filter((b: Backup) => {
          return !(b.agent === payload.diff.agent && b.ship === payload.diff.ship);
        });
      }
      // add new status to saved
      const backupState: Backup = {
        agent: payload.diff.agent,
        ship: payload.diff.ship,
        time: payload.diff.time,
      }
      console.log('pushing to backups ', backupState)
      state.backups.push(backupState);

      // update state.wrappers
      // state.wrappers[payload.agentName] = payload.state;
    },

    updateAuto(state, payload: { dif: AutoOnDiff; agent: string }) {
      console.log('got update auto ', payload)
      const agent: KeepAgentStatus = state.wrappedAgents.find((a) => {
        return a.agentName == payload.agent;
      });

      // remove if existing
      if (agent.status.auto.map((s) => s.ship).includes(payload.dif.ship)) {
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
      if (agent.status.auto.map((s) => s.ship).includes(payload.dif.ship)) {
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
      return keepApi
        .scry(scry)
        .then((r) => {
          return r;
        })
        .catch((e) => {
          throw e;
        });
    },

    copyDeps({}, payload: CopyDepsPayload) {
      return keepApi
        .pokeCopyDeps(payload)
        .then((r) => {
          // commit("localOnWyte")
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
    },

    wyteOn({ commit }) {
      return keepApi
        .wyteOn()
        .then((r) => {
          commit("localOnWyte");
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
    },
    wyteOff({ commit }) {
      return keepApi
        .wyteOff()
        .then((r) => {
          commit("localOffWyte");
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
    },
    wyteDisallow({ commit }, ship: Ship) {
      return keepApi
        .wyteDisable(ship)
        .then((r) => {
          commit("removeFromWyte", ship);
          return r;
        })
        .catch((e) => {
          throw e;
        });
    },
    wyteAllow({ commit }, ship: Ship) {
      return keepApi
        .wyteAble(ship)
        .then((r) => {
          commit("addToWyte", ship);
          return r;
        })
        .catch((e) => {
          throw e;
        });
      // add to whitelist.in
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

    handleKeepResponseState({ commit }, responseState: KeepAgentState) {
      console.log("keep response state: ", responseState);
      commit("setAuto", responseState.auto);
      commit("setBackups", responseState.backups);
      commit("setSaved", responseState.saved);
      commit("setWhitelist", responseState.whitelist);
      commit("setDesks", responseState.desks);
      commit("setAgents", responseState.agents);
    },

    handleKeepAgentDiff(ctx, payload) {
      console.log("in handle keep agent diff ", payload)
      if (payload.type === EventType.Backup) {
      // TODO: I AM THE MODEL
        ctx.dispatch('applyBackupDiff', { diff: payload.diff as Backup, state: payload.state })
      }
      if (payload.type === EventType.Success) {
        ctx.dispatch('applySuccessDiff', { diff: payload.diff as SuccessDiff, state: payload.state })
      }

    },

    handleKeepWrapperDiff(ctx, payload: { data: KeepWrapperSubscriptionResponse; agentName: AgentName; }) {
      console.log("in handle keep wrapper diff ", payload)
      if (payload.data.type === EventType.Saved) {
      // TODO: I AM THE MODEL
        ctx.dispatch('applySavedDiff', { agentName: payload.agentName as AgentName, diff: payload.data.diff as SavedStatus, state: payload.data.state as KeepWrapperState })
      }

      // TODO for all
      // if (payload.type === EventType.Saved) {
      //   ctx.dispatch('applySavedDiff', payload as KeepWrapperSavedResponse)
      // }
    },

    applySavedDiff(ctx, payload: { agentName: AgentName; diff: SavedStatus; state: KeepWrapperState; }) {
    // TODO: I AM THE MODEL
      ctx.dispatch("addSavedBackup", payload);
      ctx.dispatch("addSavedBackupMessage", payload)
    },

    applyBackupDiff(ctx, payload) {
      ctx.dispatch("addBackupStored", payload);
      ctx.dispatch("addBackupStoredMessage", payload)
    },

    applySuccessDiff(ctx, payload: { diff: SuccessDiff; state: KeepAgentState }) {
      ctx.dispatch("addBackupSuccessMessage", payload)
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
        state: { agents: Array<string> };
      }
    ) {
      // TODO: whitelist updates

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

      // TODO: this does add to state: { agents }, but I think we're not getting
      //       the agentStatus, so it doesn't immediately show up as Activateable.
      // if (payload.responseType === EventType.Agent) {
      //   const agentName = payload.diff as AgentDiff;
      //   console.log('got wrap diff' , payload);
      //   const agents = payload.state.agents;
      //   dispatch("setAgents", agents);
      // }
    },

    handleWrapperResponseState(
      { commit },
      payload: {
        agentName: string;
        state: KeepWrapperState;
      }
    ) {
      console.log(
        `handle %${payload.agentName} agent response state: `,
        payload.state
      );
      commit("setWrapperStatus", {
        agentName: payload.agentName,
        state: payload.state,
      });
    },

    // For handling diffs
    // handleAgentResponseType(
    //   { dispatch },
    //   payload: {
    //     agentName: string;
    //     responseType: EventType;
    //     diff: Diff;
    //   }
    // ) {
    //   console.log("agent response type: ", payload.responseType);
    //   console.log("agent response diff ", payload.diff);

    //   if (payload.responseType === EventType.Pending) {
    //     const d = payload.diff as PendingDiff;
    //     const time = Date.now() / 1000;
    //     const ship = d.ship;
    //     const status = d.status;

    //     if (status === InviteStatus.Invite) {
    //       dispatch("addPending", { dif: d, agent: payload.agentName });

    //       const logMsg: LogMessage = {
    //         msg: `Invite pending to ${ship}`,
    //         time,
    //         type: "pend",
    //       };
    //       dispatch("message/addMessage", logMsg, { root: true });
    //     }
    //     if (status === InviteStatus.Restore) {
    //       // TODO: Handle this type of pending.
    //       const logMsg: LogMessage = {
    //         msg: `Waiting for restore of %${payload.agentName} from ${ship}.`,
    //         time,
    //         type: "pend",
    //       };
    //       dispatch("message/addMessage", logMsg, { root: true });
    //     }
    //   }

    //   if (payload.responseType === EventType.Saved) {
    //     console.log('dddff payload', payload)
    //     const d = payload.diff as SavedStatus;
    //     const time = d.time;
    //     const ship = d.ship;

    //     dispatch("addSavedBackup", payload);

    //     let targetShip;
    //     let logMsg: LogMessage;
    //     if (ship) {
    //       targetShip = ship;
    //       logMsg = {
    //         msg: `Requested backup of %${payload.agentName} to ${targetShip} at ${time}`,
    //         time,
    //         type: "pend",
    //       };
    //     } else {
    //       targetShip = "local disk";
    //       logMsg = {
    //         msg: `Backed up %${payload.agentName} to ${targetShip} at ${time}`,
    //         time,
    //         type: "succ",
    //       };
    //     }
    //     dispatch("message/addMessage", logMsg, { root: true });
    //   }

    //   if (payload.responseType === EventType.Success) {
    //     console.log("backup done");
    //     const d = payload.diff as SuccessDiff;
    //     const sent = d.sent;
    //     const kept = d.kept;
    //     const ship = d.ship;

    //     const logMsg: LogMessage = {
    //       msg: `Backup of %${
    //         payload.agentName
    //       } saved to ${ship} at ${kept} (took ${kept - sent} seconds).`,
    //       time: kept,
    //       type: "succ",
    //     };
    //     dispatch("message/addMessage", logMsg, { root: true });
    //   }

    //   if (payload.responseType === EventType.Restored) {
    //     const d = payload.diff as RestoreDiff;
    //     const time = d.time;
    //     const ship = d.ship;

    //     // TODO: handle as dif?

    //     // TODO: also remove from pending.

    //     let targetShip;
    //     if (ship) {
    //       targetShip = ship;
    //     } else {
    //       targetShip = "local disk";
    //     }

    //     const logMsg: LogMessage = {
    //       msg: `Restored %${payload.agentName} from ${targetShip} at ${time}`,
    //       time,
    //       type: "succ",
    //     };
    //     dispatch("message/addMessage", logMsg, { root: true });
    //   }

    //   if (payload.responseType === EventType.Auto) {
    //     if (
    //       Object.prototype.hasOwnProperty.call(payload.diff, "freq") &&
    //       payload.diff.freq
    //     ) {
    //       const d = payload.diff as AutoOnDiff;
    //       const freq = d.freq;
    //       const ship = d.ship;
    //       const time = Date.now() / 1000;

    //       dispatch("addAuto", { dif: d, agent: payload.agentName });

    //       let targetShip;
    //       if (ship) {
    //         targetShip = ship;
    //       } else {
    //         targetShip = "local disk";
    //       }
    //       const logMsg: LogMessage = {
    //         msg: `Recurring backups for %${payload.agentName} to ${targetShip} activated every ${freq} seconds`,
    //         time,
    //         type: "info",
    //       };
    //       dispatch("message/addMessage", logMsg, { root: true });
    //     } else {
    //       const d = payload.diff as AutoOffDiff;
    //       const time = Date.now() / 1000;
    //       const ship = d.ship;

    //       dispatch("removeAuto", { dif: d, agent: payload.agentName });

    //       let targetShip;
    //       if (ship) {
    //         targetShip = ship;
    //       } else {
    //         targetShip = "local disk";
    //       }
    //       const logMsg: LogMessage = {
    //         msg: `Recurring backups for %${payload.agentName} to ${targetShip} stopped`,
    //         time,
    //         type: "info",
    //       };
    //       dispatch("message/addMessage", logMsg, { root: true });
    //     }
    //   }

    //   if (payload.responseType === EventType.Active) {
    //     const active = payload.diff as ActiveDiff;
    //     const agent = payload.agentName;
    //     if (active) {
    //       const time = Date.now() / 1000;

    //       dispatch("addActive", {
    //         dif: active,
    //         agent: payload.agentName,
    //       });

    //       const logMsg: LogMessage = {
    //         msg: `${agent} activated!`,
    //         time,
    //         type: "succ",
    //       };
    //       dispatch("message/addMessage", logMsg, { root: true });
    //     } else {
    //       const time = Date.now() / 1000;

    //       dispatch("removeActive", {
    //         dif: active,
    //         agent: payload.agentName,
    //       });

    //       const logMsg: LogMessage = {
    //         msg: `${agent} deactivated!`,
    //         time,
    //         type: "fail",
    //       };
    //       dispatch("message/addMessage", logMsg, { root: true });
    //     }
    //   }
    // },

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

    backupLocal(ctx, payload: BackupPayload) {
      return keepApi
        .pokeOnce(payload)
        .then((r) => {
          return r;
        })
        .catch((e) => {
          throw e.response;
        });
    },

    localMany(ctx, payload: ManyPayload) {
      return keepApi
        .pokeMany(payload)
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

    addPending({ commit }, payload: { dif: PendingDiff; agent: string }) {
      commit("addPending", payload);
    },

    addKeptBackup({ commit }, payload: { dif: BackupDiff; agent: string }) {
      commit("updateBackup", payload);
    },

    addSavedBackup({ commit }, payload: { agentName: AgentName; diff: SavedStatus, state:KeepWrapperState }) {
      // TODO: I AM THE MODEL
      commit("updateSaved", payload);
    },
    addSavedBackupMessage(ctx, payload: KeepWrapperSavedResponse) {
      let targetShip;
      let logMsg: LogMessage;
      const ship = payload.diff.ship
      const agentName = payload.diff.agent
      const time = payload.diff.time
      if (ship) {
        targetShip = ship;
        logMsg = {
          msg: `Requested backup of %${agentName} to ${targetShip} at ${time}`,
          time,
          type: "pend",
        };
      } else {
        targetShip = "local disk";
        logMsg = {
          msg: `Backed up %${agentName} to ${targetShip} at ${time}`,
          time,
          type: "succ",
        };
      }
      ctx.dispatch("message/addMessage", logMsg, { root: true });
    },

    addBackupStored({ commit }, payload: { diff: Backup, state: KeepAgentState; }) {
      commit("updateBackups", payload);
    },
    addBackupStoredMessage(ctx, payload: { diff: Backup, state: KeepAgentState; }) {
      let targetShip;
      let logMsg: LogMessage;
      const ship = payload.diff.ship
      const agentName = payload.diff.agent
      const time = payload.diff.time
      if (ship) {
        targetShip = ship;
        logMsg = {
          msg: `Saved backup of %${agentName} from ${targetShip} at ${time}`,
          time,
          type: "succ",
        };
      } else {
        targetShip = "local disk";
        logMsg = {
          msg: `Backed up %${agentName} to local disk at ${time}`,
          time,
          type: "succ",
        };
      }
      ctx.dispatch("message/addMessage", logMsg, { root: true });
    },

    addBackupSuccessMessage(ctx, payload: { diff: SuccessDiff, state: KeepAgentState; }) {
      let targetShip;
      let logMsg: LogMessage;
      const ship = payload.diff.ship
      const agentName = payload.diff.agent
      const sent = payload.diff.sent
      const kept = payload.diff.kept
      if (ship) {
        targetShip = ship;
        logMsg = {
          msg: `Backup of ${agentName} saved by ${targetShip} at ${kept}. (sent at ${sent})`,
          time: kept,
          type: "succ",
        };
      } else {
        targetShip = "local disk";
        logMsg = {
          msg: `Backup of ${agentName} saved to ${targetShip} at ${kept}. (sent at ${sent})`,
          time: kept,
          type: "succ",
        };
      }
      ctx.dispatch("message/addMessage", logMsg, { root: true });
    },

    addAuto({ commit }, payload: { dif: AutoOnDiff; agent: string }) {
      commit("updateAuto", payload);
    },

    removeAuto({ commit }, payload: { dif: AutoOffDiff; agent: string }) {
      commit("removeAuto", payload);
    },

    addActive({ commit }, payload: { dif: ActiveDiff; agent: string }) {
      commit("addActive", payload);
    },

    removeActive({ commit }, payload: { dif: ActiveDiff; agent: string }) {
      commit("removeActive", payload);
    },
  },
};
