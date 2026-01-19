const orderByOptions = {
  NAME: 'name',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
} as const;

type orderByOptions = typeof orderByOptions[keyof typeof orderByOptions];

interface IProject {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  imageUrl: string | null | undefined;
  favorited: boolean;
}

interface ISearchParams {
  favorited?: boolean;
  orderBy?: orderByOptions;
  orderDirection?: 'asc' | 'desc';
  name?: string;
}

export type { IProject, ISearchParams, orderByOptions };