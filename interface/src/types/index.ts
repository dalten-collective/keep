export interface PendingStatus {
  status: string;
  ship: string;
}

export interface SavedStatus {
  ship: string;
  time: number;
}

export interface AutoStatus {
  ship: string;
  freq: number;
}

export interface RestoredStatus {
  ship: string;
  time: number;
}

export interface KeepAgentSubscriptionStatus {
  pending: Array<PendingStatus>;
  auto: Array<AutoStatus>;
  saved: Array<SavedStatus>;
  restored: Array<RestoredStatus>;
  active: boolean;
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
  ship: string;
  agentName: string;
}

export interface ManyRequest {
  ship: string;
  agentName: string;
  freq: number;
}

export interface UnsetManyRequest {
  ship: string;
  agentName: string;
  freq: null;
}

export interface RestoreRequest {
  ship: string;
  agentName: string;
}
