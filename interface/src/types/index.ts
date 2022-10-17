export enum EventType {
  Success = "success", // Backup saved successfully
  Initial = "initial", // first response on subscrtiption start
  Backup = "backup", // WE did a backup for someone else
  Saved = "saved", // OUR backup was requested with someone else
  Auto = "auto", // auto-backup configured
  Pending = "pending", // backup-to ship invited
  Restored = "restored", // backup has been restored
  Active = "active", // wrapper 'live' has changed // TODO: deprecated
  NewAgent = "agent", // new agent has been wrapped
  CopiedDeps = "copied-deps", // Begun copying deps for agent
  Agent = "agent", // the main keep agent has done something (like wrapping)
}

export interface WytePokePayload {
  wyte: boolean;
}
export interface WytePoke {
  app: "keep";
  mark: "keep-agent";
  json: WytePokePayload;
}

export interface WyteAblePayload {
  able: {
    able: boolean;
    ship: string;
  };
}
export interface WyteAblePoke {
  app: "keep";
  mark: "keep-agent";
  json: WyteAblePayload;
}

export interface CopyDepsPayload {
  copy: string;
  // TODO: soon to include a boolean for disabling
}
export interface CopyDepsPoke {
  app: "keep";
  mark: "keep-agent";
  json: CopyDepsPayload;
}
export interface CopyDepsDiff {
  type: EventType.CopiedDeps;
  diff: AgentName;
  state: KeepAgentState;
}

export interface BackupPayload {
  once: {
    from: AgentName;
    to: Ship | null;
  };
}
export interface BackupPoke {
  app: "keep";
  mark: "keep-agent";
  json: BackupPayload;
}

export interface ManyPayload {
  many: {
    from: AgentName;
    to: Ship | null;
    freq: number | null;
  };
}
export interface ManyPoke {
  app: "keep";
  mark: "keep-agent";
  json: ManyPayload;
}

export interface MendPayload {
  mend: Ship;
}
export interface MendPoke {
  app: AgentName;
  mark: "keep";
  json: MendPayload;
}

////
//
//
//
//
//

export interface KeepAgentInitialResponse {
  type: EventType.Initial;
  diff: null;
  state: KeepAgentState;
}
export interface KeepAgentAgentEnrichedResponse {
  type: EventType.Agent;
  diff: AgentName;
  state: KeepAgentState;
}
export interface KeepAgentDepsCopiedResponse {
  type: EventType.CopiedDeps;
  diff: AgentName;
  state: KeepAgentState;
}

export interface KeepWrapperInitialResponse {
  type: EventType.Initial;
  diff: null;
  state: KeepWrapperState;
}
export interface KeepWrapperPendingResponse {
  type: EventType.Pending;
  diff: null;
  state: KeepWrapperState;
}
export interface KeepWrapperSavedResponse {
  type: EventType.Saved;
  diff: SavedStatus;
  state: KeepWrapperState;
}
export interface KeepWrapperBackupResponse {
  type: EventType.Backup;
  diff: null;
  state: KeepWrapperState;
}
export interface KeepWrapperRestoredResponse {
  type: EventType.Restored;
  diff: null;
  state: KeepWrapperState;
}

////
//
//
//
//
//
//
export enum InviteStatus {
  Invite = "invite",
  Restore = "restore",
}

export type Ship = string;
export type AgentName = string;
export type DeskName = string;

export interface Backup {
  ship: Ship;
  agent: string;
  time: number;
}

export interface WhitelistSettings {
  on: boolean;
  in: Array<Ship>;
}

export interface RestoreDiff {
  ship: Ship;
  time: number;
}

export interface SavedDiff {
  diff: SavedStatus;
  agent: AgentName;
}

export interface AgentDiff {
  agent: string;
}

export interface BackupDiff {
  agent: string;
  ship: Ship;
  time: number;
}

export interface AutoOnDiff {
  ship: Ship;
  agent: AgentName;
  freq: number;
}

export interface AutoOffDiff {
  ship: Ship;
  agent: AgentName;
  freq: number;
}

export interface PendingDiff {
  ship: Ship;
  status: InviteStatus;
}

export type ActiveDiff = boolean;

export interface SuccessDiff {
  agent: AgentName;
  ship: Ship;
  sent: number;
  kept: number;
}

export type Diff =
  | RestoreDiff
  | BackupDiff
  | SavedDiff
  | ActiveDiff
  | SuccessDiff
  | AutoOnDiff
  | AutoOffDiff
  | ActiveDiff
  | PendingDiff;

export interface KeepAgentSubscriptionResponse {
  state: KeepAgentState;
  diff: Diff;
  type: EventType;
}

export interface KeepWrapperSubscriptionResponse {
  state: KeepWrapperState;
  diff: Diff;
  type: EventType;
}

export interface KeepAgentState {
  agents: Array<AgentName>;
  auto: Array<AutoStatus>;
  backups: Array<Backup>;
  desks: Array<DeskName>;
  saved: Array<SavedStatus>;
  whitelist: WhitelistSettings;
}

export interface KeepWrapperState {
  pending: Array<PendingStatus>;
}

export interface PendingStatus {
  status: "invite" | "restore";
  ship: Ship;
}

export interface SavedStatus {
  agent: AgentName;
  ship: Ship;
  time: number;
}

export interface AutoStatus {
  agent: AgentName;
  ship: Ship;
  freq: number;
}

export interface RestoredStatus {
  ship: Ship;
  time: number;
}

export interface KeepAgentSubscriptionStatus {
  pending: Array<PendingStatus>;
  auto: Array<AutoStatus>;
  saved: Array<SavedStatus>;
  restored: Array<RestoredStatus>;
  live: boolean;
}

export interface KeepAgentStatus {
  agentName: string;
  status: KeepAgentSubscriptionStatus;
}

export interface AgentSubscription {
  agentName: string;
  subscriptionNumber: number;
}

export interface OnceRequest {
  ship: Ship;
  agentName: string;
}

export interface LocalBackupRequest {
  agentName: string;
}

export interface LocalManyRequest {
  agentName: string;
  freq: number;
}

export interface ManyRequest {
  ship: Ship;
  agentName: string;
  freq: number;
}

export interface UnsetManyRequest {
  ship: Ship;
  agentName: string;
  freq: null;
}

export interface RestoreRequest {
  ship: Ship;
  agentName: string;
}

export interface LogMessage {
  msg: string;
  time: number; // Seconds since epoch
  type: string;
}
