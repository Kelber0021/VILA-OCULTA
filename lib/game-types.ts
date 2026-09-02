export const AVATAR_IDS = ["ana", "bento", "clara", "davi", "elisa", "joaquim"] as const;
export type AvatarId = (typeof AVATAR_IDS)[number];
export type Role = "citizen" | "assassin" | "sheriff" | "angel";
export type Phase = "lobby" | "night" | "discussion" | "voting" | "results" | "finished";
export type Winner = "village" | "assassin";
export interface PlayerView {
  id: string;
  name: string;
  avatarId: AvatarId;
  ready: boolean;
  alive: boolean;
  isHost: boolean;
  hasVoted: boolean;
  /** Revealed for everyone only once the entire match finishes. */
  revealedRole?: Role;
}
export interface NarrationEvent { id: string; text: string; at: number }
export interface ChatMessage { id: string; playerId: string; playerName: string; text: string; at: number }
export interface RoomView {
  code: string;
  phase: Phase;
  round: number;
  players: PlayerView[];
  self: {
    id: string;
    role: Role | null;
    hasActed: boolean;
    voteTargetId: string | null;
    investigation: { targetName: string; isAssassin: boolean; round: number } | null;
  };
  narration: NarrationEvent[];
  messages: ChatMessage[];
  phaseEndsAt: number | null;
  serverNow: number;
  winner: Winner | null;
  minPlayers: number;
  maxPlayers: number;
}
export type RoomAction =
  | { type: "ready"; ready: boolean }
  | { type: "avatar"; avatarId: AvatarId }
  | { type: "start" }
  | { type: "rematch" }
  | { type: "night"; targetId: string }
  | { type: "vote"; targetId: string | null }
  | { type: "chat"; text: string }
  | { type: "leave" };
export interface RoomResponse { room: RoomView | null }
