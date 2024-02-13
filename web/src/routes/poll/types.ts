export type Option = {
  id: string;
  pollOptionId?: string;
  title: string;
  votes: number;
};

export type PollByIdResponse = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  options: Array<Option>;
};

export type LoaderParams = {
  params: { pollId: string };
};

export type LoaderData = {
  data: PollByIdResponse;
};
