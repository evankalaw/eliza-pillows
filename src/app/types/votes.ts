export type Vote = {
  id: number;
  selected: boolean;
  userVoted: boolean;
};

export type VoteState = {
  votes: Vote[];
};
