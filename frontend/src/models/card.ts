import type { Avatar } from "./user";

export type Card = {
  readonly id: number;
  readonly generation: number;
  readonly handle: string;
  readonly avatar?: Avatar;
  readonly workshops: readonly string[];
  readonly squads: readonly string[];
  readonly twitterScreenName?: string;
  readonly discordID?: string;
};
