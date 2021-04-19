export type Feed = {
  id: string;
  links: LinkType[];
  count: number;
};

export type LinkType = {
  id: string;
  description: string;
  url: string;
  postedBy?: User;
  votes: Vote[];
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  links: LinkType[];
};

type Vote = {
  id: string;
  link: LinkType;
  user: User;
};
