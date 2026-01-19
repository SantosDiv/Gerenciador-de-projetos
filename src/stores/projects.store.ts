import { defineStore } from 'pinia';
import type { IProject } from '@/interfaces/project.interface';
import projectApi from '@/api/projectApi';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    searchTerm: '' as string,
    searchResults: [] as IProject[],
  }),
  actions: {
    async searchByTerm(term: string): Promise<IProject[]> {
      const projects = await projectApi.getProjects({ name: term });
      this.searchTerm = term;
      this.searchResults = projects;
      console.log('Search results:', projects);
      return projects;
    },
    
    clearSearch() {
      this.searchTerm = '';
      this.searchResults = [];
    }
  },
});