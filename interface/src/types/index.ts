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
}

export interface KeepAgentStatus {
  agentName: string;
  status: KeepAgentSubscriptionStatus;
}

interface AgentSubscription {
  agentName: string;
  subscriptionNumber: number;
}
