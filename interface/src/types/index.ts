export enum EventType {
  Initial = "initial", // first response on subscrtiption start
  Saved = "saved", // backup has happened
  Auto = "auto", // auto-backup configured
  Pending = "pending", // backup-to ship invited
  Restored = "restored", // backup has been restored
  Active = "active", // wrapper 'live' has changed
}

type Ship = string;

export interface KeepSubscriptionResponse {
  state: KeepSubscriptionState;
  diff: object; // TODO: define types of diffs
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
