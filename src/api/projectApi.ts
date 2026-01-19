import type { IProject, ISearchParams, orderByOptions } from "@/interfaces/project.interface";

class ProjectApi {
  provider: Storage;

  constructor() {
    this.provider = localStorage;
  }

  async saveProject(project: IProject): Promise<IProject[]> {
    try {
      const projects = await this.getProjects();
      projects.push(project);
      this.provider.setItem('projects', JSON.stringify(projects));
      return projects;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getProjects(searchParams?: ISearchParams): Promise<IProject[]> {
    try {
      const projectsData = this.provider.getItem('projects');
      const projectsDataParsed: IProject[] = projectsData ? JSON.parse(projectsData) : [];

      let filteredProjects = projectsDataParsed;

      if (searchParams?.favorited !== undefined) {
        filteredProjects = this.filterProjectsByFavorited(filteredProjects, searchParams.favorited);
      }

      if (searchParams?.orderBy) {
        filteredProjects = this.sortProjects(
          filteredProjects,
          searchParams.orderBy,
          searchParams.orderDirection || 'asc'
        );
      }

      if (searchParams?.name) {
        filteredProjects = this.searchProjectsByName(filteredProjects, searchParams.name);
      }

      return filteredProjects;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getProjectById(projectId: string): Promise<IProject | null> {
    try {
      const projects = await this.getProjects();
      const project = projects.find(p => p.id === projectId) || null;
      return project;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateProject(updatedProject: IProject): Promise<IProject> {
    try {
      const projects = await this.getProjects();
      const index = projects.findIndex(p => p.id === updatedProject.id);
      if (index !== -1) {
        projects[index] = updatedProject;
        this.provider.setItem('projects', JSON.stringify(projects));
      }
  
      return updatedProject;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteProject(projectId: string): Promise<IProject[]> {
    try {
      const projects = await this.getProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      this.provider.setItem('projects', JSON.stringify(filteredProjects));
      return filteredProjects;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private filterProjectsByFavorited(projects: IProject[], favorited: boolean): IProject[] {
    return projects.filter(project => project.favorited === favorited);
  }

  private sortProjects(projects: IProject[], orderBy: orderByOptions, orderDirection: 'asc' | 'desc'): IProject[] {
    return projects.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (orderBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'startDate':
          aValue = new Date(a.startDate).getTime();
          bValue = new Date(b.startDate).getTime();
          break;
        case 'endDate':
          aValue = new Date(a.endDate).getTime();
          bValue = new Date(b.endDate).getTime();
          break;
      }

      if (aValue < bValue) return orderDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return orderDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private searchProjectsByName(projects: IProject[], name: string): IProject[] {
    const nameLower = name.toLowerCase();
    this.saveHistory(name);
    return projects.filter(project =>
      project.name.toLowerCase().includes(nameLower)
    );
  }

  private saveHistory(term: string): void {
    const historyData = this.provider.getItem('searchHistory');
    const history: string[] = historyData ? JSON.parse(historyData) : [];

    if(history.length >= 5) {
      history.pop();
    }
    console.log(history);
    if (!history.includes(term)) {
      history.unshift(term);
      this.provider.setItem('searchHistory', JSON.stringify(history));
    }
  }
}

export default new ProjectApi();