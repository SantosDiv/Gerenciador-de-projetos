interface IProject {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  imageUrl: FileList | File[] | null | undefined;
  favorited: boolean;
}

export type { IProject };