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
  KeepAgentSubscriptionStatus,
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

    wrapperStatus: (state) => (
      soughtAgentName: AgentName
    ): KeepWrapperState | null => {
      const pending: Array<PendingStatus> | [] = [];
      return {
        pending,
      };
    },

    agentStatus: (state: KeepAgentState) => (soughtAgentName: AgentName) => {
      console.log(state);
      const auto: Array<AutoStatus> | [] = state.auto.filter(
        (a: AutoStatus) => {
          return a.agent === soughtAgentName;
        }
      );
      const backup: Array<Backup> | [] = state.backups.filter((b: Backup) => {
        return b.agent === soughtAgentName;
      });
      const saved: Array<SavedStatus> | [] = state.saved.filter(
        (s: SavedStatus) => {
          return s.agent === soughtAgentName;
        }
      );
      return {
        auto,
        backup,
        saved,
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
      console.log("setWrapperStatus...: ", payload);
      state.wrappers[payload.agentName] = payload.state;
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
    updateSaved(
      state,
      payload: {
        agentName: AgentName;
        diff: SavedStatus;
        state: KeepWrapperState;
      }
    ) {
      // remove if existing
      if (
        state.saved.map((s: SavedStatus) => s.agent).includes(payload.agentName)
      ) {
        state.saved = state.saved.filter((s: SavedStatus) => {
          return !(
            s.agent === payload.agentName && s.ship === payload.diff.ship
          );
        });
      }
      // add new status to saved
      const savedState = {
        agent: payload.agentName,
        ship: payload.diff.ship,
        time: payload.diff.time,
      };
      state.saved.push(savedState);

      // update state.wrappers
      state.wrappers[payload.agentName] = payload.state;
    },

    updateBackups(
      state,
      payload: {
        diff: SavedStatus;
        state: KeepWrapperState;
      }
    ) {
      // remove if existing
      console.log("remove backups", payload);
      if (
        state.backups.map((b: Backup) => b.agent).includes(payload.diff.agent)
      ) {
        state.backups = state.backups.filter((b: Backup) => {
          return !(
            b.agent === payload.diff.agent && b.ship === payload.diff.ship
          );
        });
      }
      // add new status to saved
      const backupState: Backup = {
        agent: payload.diff.agent,
        ship: payload.diff.ship,
        time: payload.diff.time,
      };
      state.backups.push(backupState);

      // update state.wrappers
      // state.wrappers[payload.agentName] = payload.state;
    },

    addToDesks(state, deskName) {
      state.desks.push(deskName);
    },
    addToAgents(state, agentName) {
      state.agents.push(agentName);
    },

    updateAuto(state, payload: { diff: AutoOnDiff; state: KeepAgentState }) {
      const agent = payload.diff.agent;
      const ship = payload.diff.ship;

      // remove if existing
      state.auto = state.auto.filter((a: AutoStatus) => {
        return !(a.ship === ship && a.agent == agent);
      });

      // add new status to auto
      state.auto.push(payload.diff);
    },

    removeAuto(state, payload: { diff: AutoOffDiff; state: KeepAgentState }) {
      const agent = payload.diff.agent;
      const ship = payload.diff.ship;

      // remove if existing
      state.auto = state.auto.filter((a: AutoStatus) => {
        return !(a.ship === ship && a.agent == agent);
      });
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
        .pokeWyteOn()
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
        .pokeWyteOff()
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
        .pokeWyteDisable(ship)
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
        .pokeWyteAble(ship)
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
      console.log("in handle keep agent diff ", payload);
      if (payload.type === EventType.Backup) {
        // TODO: I AM THE MODEL
        ctx.dispatch("applyBackupDiff", {
          diff: payload.diff as Backup,
          state: payload.state,
        });
      }
      if (payload.type === EventType.Success) {
        ctx.dispatch("applySuccessDiff", {
          diff: payload.diff as SuccessDiff,
          state: payload.state,
        });
      }
      if (payload.type === EventType.Auto) {
        ctx.dispatch("applyAutoDiff", {
          diff: payload.diff as AutoOnDiff | AutoOffDiff,
          state: payload.state,
        });
      }
      if (payload.type === EventType.CopiedDeps) {
        ctx.dispatch("applyCopiedDepsDiff", {
          diff: payload.diff as AgentName,
          state: payload.state as KeepAgentState,
        });
      }
      if (payload.type === EventType.Agent) {
        ctx.dispatch("applyWrappedAgentDiff", {
          diff: payload.diff as AgentName,
          state: payload.state as KeepAgentState,
        });
      }
    },

    handleKeepWrapperDiff(
      ctx,
      payload: { data: KeepWrapperSubscriptionResponse; agentName: AgentName }
    ) {
      console.log("in handle keep wrapper diff ", payload);

      if (payload.data.type === EventType.Saved) {
        // TODO: I AM THE MODEL
        ctx.dispatch("applySavedDiff", {
          agentName: payload.agentName as AgentName,
          diff: payload.data.diff as SavedStatus,
          state: payload.data.state as KeepWrapperState,
        });
      }

      if (payload.data.type === EventType.Restored) {
        ctx.dispatch("applyRestoredDiff", {
          agentName: payload.agentName as AgentName,
          diff: payload.data.diff as RestoredStatus,
          state: payload.data.state as KeepWrapperState,
        });
      }

      // TODO for all
      // if (payload.type === EventType.Saved) {
      //   ctx.dispatch('applySavedDiff', payload as KeepWrapperSavedResponse)
      // }
    },

    applySavedDiff(
      ctx,
      payload: {
        agentName: AgentName;
        diff: SavedStatus;
        state: KeepWrapperState;
      }
    ) {
      // TODO: I AM THE MODEL
      ctx.dispatch("addSavedBackup", payload);
      ctx.dispatch("addSavedBackupMessage", payload);
    },

    applyBackupDiff(
      ctx,
      payload: {
        diff: SavedStatus;
        state: KeepWrapperState;
      }
    ) {
      ctx.dispatch("addBackupStored", payload);
      ctx.dispatch("addBackupStoredMessage", payload);
    },

    applyCopiedDepsDiff(
      ctx,
      payload: { diff: AgentName; state: KeepAgentState }
    ) {
      ctx.dispatch("addDeskDepped", payload.diff);
      ctx.dispatch("addDepsCopiedMessage", payload.diff);
    },

    applyWrappedAgentDiff(
      ctx,
      payload: { diff: AgentName; state: KeepAgentState }
    ) {
      ctx.dispatch("addAgent", payload.diff);
      ctx.dispatch("addAgentWrappedMessage", payload.diff);
    },

    applySuccessDiff(
      ctx,
      payload: { diff: SuccessDiff; state: KeepAgentState }
    ) {
      ctx.dispatch("addBackupSuccessMessage", payload);
    },

    applyAutoDiff(
      ctx,
      payload: { diff: AutoOnDiff | AutoOffDiff; state: KeepAgentState }
    ) {
      if (payload.diff.freq === null) {
        ctx.dispatch("removeAuto", payload);
      } else {
        ctx.dispatch("addAuto", payload);
      }
      ctx.dispatch("addAutoChangedMessage", payload);
    },

    applyRestoredDiff(
      ctx,
      payload: {
        agentName: AgentName;
        diff: RestoredStatus;
        state: KeepWrapperState;
      }
    ) {
      ctx.dispatch("addRestoredSuccessMessage", payload);
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

    backupRemote(ctx, payload: BackupPayload) {
      return keepApi
        .pokeOnce(payload)
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

    // TODO: remove
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

    // TODO: remove
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

    // TODO: remove
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

    addSavedBackup(
      { commit },
      payload: {
        agentName: AgentName;
        diff: SavedStatus;
        state: KeepWrapperState;
      }
    ) {
      // TODO: I AM THE MODEL
      commit("updateSaved", payload);
    },
    addSavedBackupMessage(
      ctx,
      payload: {
        agentName: AgentName;
        diff: SavedStatus;
        state: KeepWrapperState;
      }
    ) {
      let targetShip;
      let logMsg: LogMessage;
      const ship = payload.diff.ship;
      const agentName = payload.agentName;
      const time = payload.diff.time;
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

    addBackupStored(
      { commit },
      payload: {
        diff: SavedStatus;
        state: KeepWrapperState;
      }
    ) {
      commit("updateBackups", payload);
    },
    addBackupStoredMessage(
      ctx,
      payload: {
        diff: SavedStatus;
        state: KeepWrapperState;
      }
    ) {
      let targetShip;
      let logMsg: LogMessage;
      const ship = payload.diff.ship;
      const agentName = payload.diff.agent;
      const time = payload.diff.time;
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

    addDeskDepped(ctx, agentName: AgentName) {
      ctx.commit("addToDesks", agentName);
    },
    addDepsCopiedMessage(ctx, agentName: AgentName) {
      const time = Math.round(Date.now() / 1000)
      const logMsg: LogMessage = {
        msg: `Dependencies copied for %${agentName}.`,
        time,
        type: "succ",
      };
      ctx.dispatch("message/addMessage", logMsg, { root: true });
    },

    addAgent(ctx, agentName: AgentName) {
      ctx.commit("addToAgents", agentName);
    },
    addAgentWrappedMessage(ctx, agentName: AgentName) {
      const time = Math.round(Date.now() / 1000);
      const logMsg: LogMessage = {
        msg: `%${agentName} wrapped successfully!.`,
        time,
        type: "succ",
      };
      ctx.dispatch("message/addMessage", logMsg, { root: true });
    },

    addAutoChangedMessage(
      ctx,
      payload: { diff: AutoOnDiff | AutoOffDiff; state: KeepAgentState }
    ) {
      let targetShip: string;
      let logMsg: LogMessage;
      const ship = payload.diff.ship;
      const agentName = payload.diff.agent;
      const freq = payload.diff.freq;

      if (ship) {
        targetShip = ship;
      } else {
        targetShip = "local disk";
      }

      if (freq === null) {
        // auto off
        logMsg = {
          msg: `Automatic backups of %${agentName} to ${targetShip} disabled.`,
          time: Math.round(Date.now() / 1000),
          type: "fail",
        };
      } else {
        // auto on
        logMsg = {
          msg: `Automatic backups of %${agentName} every ${freq} seconds to ${targetShip} enabled!`,
          time: Math.round(Date.now() / 1000),
          type: "succ",
        };
      }

      ctx.dispatch("message/addMessage", logMsg, { root: true });
    },
    addBackupSuccessMessage(
      ctx,
      payload: {
        diff: SuccessDiff;
        state: KeepAgentState;
      }
    ) {
      let targetShip: string | Ship;
      let logMsg: LogMessage;
      const ship = payload.diff.ship;
      const agentName = payload.diff.agent;
      const sent = payload.diff.sent;
      const kept = payload.diff.kept;
      if (ship) {
        targetShip = ship;
        logMsg = {
          msg: `Backup of %${agentName} saved by ${targetShip} at ${kept}. (sent at ${sent})`,
          time: kept,
          type: "succ",
        };
      } else {
        targetShip = "local disk";
        logMsg = {
          msg: `Backup of %${agentName} saved to ${targetShip} at ${kept}. (sent at ${sent})`,
          time: kept,
          type: "succ",
        };
      }
      ctx.dispatch("message/addMessage", logMsg, { root: true });
    },

    addRestoredSuccessMessage(
      ctx,
      payload: {
        agentName: AgentName;
        diff: RestoredStatus;
        state: KeepWrapperState;
      }
    ) {
      let targetShip: string | Ship;
      let logMsg: LogMessage;
      const ship = payload.diff.ship;
      const agentName = payload.agentName;
      const time = payload.diff.time;
      if (ship) {
        targetShip = ship;
        logMsg = {
          msg: `Restored backup of %${agentName} from ${targetShip} at ${time}`,
          time,
          type: "succ",
        };
      } else {
        targetShip = "local disk";
        logMsg = {
          msg: `Restored backup %${agentName} from ${targetShip} at ${time}`,
          time,
          type: "succ",
        };
      }
      ctx.dispatch("message/addMessage", logMsg, { root: true });
    },

    addAuto({ commit }, payload: { diff: AutoOnDiff; state: KeepAgentState }) {
      commit("updateAuto", payload);
    },

    removeAuto(
      { commit },
      payload: { diff: AutoOffDiff; state: KeepAgentState }
    ) {
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
