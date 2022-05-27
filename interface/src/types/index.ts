export enum EventType {
  Initial = "initial", // first response on subscrtiption start
  Saved = "saved", // backup has happened
  Auto = "auto", // auto-backup configured
  Pending = "pending", // backup-to ship invited
  Restored = "restored", // backup has been restored
  Active = "active", // wrapper 'live' has changed
  NewAgent = "agent", // new agent has been wrapped
}

export enum InviteStatus {
  Invite = "invite",
  Restore = "restore",
}

type Ship = string;

export interface RestoreDiff {
  ship: Ship;
  time: number;
}

export interface BackupDiff {
  ship: Ship;
  time: number;
}

export interface AutoOnDiff {
  ship: Ship;
  freq: number;
}

export interface PendingDiff {
  ship: Ship;
  status: InviteStatus;
}

export type ActiveDiff = boolean;

export interface AutoOffDiff {
  ship: Ship;
  time: number;
}

export type Diff =
  | RestoreDiff
  | BackupDiff
  | AutoOnDiff
  | AutoOffDiff
  | ActiveDiff
  | PendingDiff;

export interface KeepSubscriptionResponse {
  state: KeepSubscriptionState;
  diff: Diff;
  type: EventType;
}

export interface KeepAgentSubscriptionResponse {
  state: KeepAgentSubscriptionStatus;
  diff: object; // TODO: define types of diffs
  type: EventType;
}

export interface KeepSubscriptionState {
  agents: Array<Ship>;
}

export interface PendingStatus {
  status: string;
  ship: Ship;
}

export interface SavedStatus {
  ship: Ship;
  time: number;
}

export interface AutoStatus {
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
  time: number;
}
