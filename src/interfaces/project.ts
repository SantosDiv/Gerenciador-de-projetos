interface IProject {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  imageUrl: string | null | undefined;
  favorited: boolean;
}

export type { IProject };