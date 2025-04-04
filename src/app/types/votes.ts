export type Vote = {
  id: number;
  selected: boolean;
  userVoted: boolean;
  pillowPath: string;
};

export type VoteState = {
  votes: Vote[];
};
